var request = require("request");
var settings = require("./settings.js");
var TwitterBot = require("node-twitterbot").TwitterBot;
var express = require("express");
var app = express();
var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});

//Header for the request package for the GET request to GitHub
var headers = {
  "User-Agent": settings.screenName,
  "ETag": "a18c3bded88eb5dbb5c849a489412bf3"
};

var options = {
  "url": "https://api.github.com/events",
  "headers": headers,
  //With GitHub token, I have almost 5000 API requests at a time, which is more than enough
  "auth": {
    "username": settings.githubToken + ":x-oauth-basic"
  }
};

var bot = new TwitterBot(settings.twitterAccess);
//The "funny" words and "bad" words
var yes_words = settings.yesWords;
var no_words = settings.noWords;
//Stores previous tweets
var last_tweets_queue = [];

//Determines whether the @param message is actually funny
//Returns true if funny, false otherwise
function isFunny(message) {
  var yesPattern = new RegExp(yes_words.join("|"));
  var noPattern = new RegExp(no_words.join("|"));
  return message.length < 125 &&
  yesPattern.test(message.toLowerCase()) && !noPattern.test(message.toLowerCase());
}
//Given an api url, the function extacts the user name from the url, and formats it
//into a publicly accessible link to their GitHub profile
function extractNameFromUrl(url){
  var remove_head = url.split("https://api.github.com/repos/")[1];
  var user_name = remove_head.split("/")[0];
  return "http://www.github.com/"+user_name;
}

function parse_github_results(err, res, body) {
  try {
    if (res.statusCode !== 304) {
      var r = [].concat.apply([], JSON.parse(body)
        .filter(function (e) { return e.type === "PushEvent" })
        .map(function (e) {
          return e.payload.commits.filter(function (f) {
            return isFunny(f.message);
          })
        }).filter(function (e) { return e.length > 0; }));
      for (i in r) {
        var url = r[i].url;
        var url_user_name = extractNameFromUrl(url);
        var commit = r[i].message;
        var owner = r[i].author.name;
        var tweet = commit + " ~ " + owner + " ~ " + url_user_name;
        /*
          Checks queue of previous tweets before tweeting this one
          This allows for multiple tweets by same owner (consecutively)
          But doesn't post the same tweet again
        */
        if (last_tweets_queue.indexOf(tweet) < 0){
          bot.tweet(tweet);
          console.log("Tweeted: " + tweet);
          last_tweets_queue.push(tweet);
          //Limit of 50 on the queue, kicks off the first one added
          if (last_tweets_queue.length > 50){
            last_tweets_queue.shift();
          }
        } else{ //Already posted
          console.log("I found the same tweet, so not posting it again");
        }
      }
    }
  } catch (e) {
    console.log("ERROR: " + e.message);
  }
  //Repeats this function indefinitely
  setTimeout(function () {
    //Request package used to submit get request with @param options
    //Callback is function parse_github_results
    request(options, parse_github_results);
  }, 5000);
}

request(options, parse_github_results);
