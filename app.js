var request = require("request");
var settings = require("./settings.js");
var TwitterBot = require("node-twitterbot").TwitterBot;

var headers = {
  "User-Agent": "callouscommits",
  "ETag": "a18c3bded88eb5dbb5c849a489412bf3"
};

var options = {
  "url": "https://api.github.com/events",
  "headers": headers,
  "auth": {
    "username": settings.githubToken + ":x-oauth-basic"
  }
};

var bot = new TwitterBot(settings.twitterAccess);

var yes_words = ['fuck', 'shit', 'crap', 'damn', 'bitch'];

var no_words = ['merge', 'branch'];

var last_tweets_queue = [];

function checkCommit(message) {
  var yesPattern = new RegExp(yes_words.join("|"));
  var noPattern = new RegExp(no_words.join("|"));
  return message.length < 125 &&
  yesPattern.test(message.toLowerCase()) && !noPattern.test(message.toLowerCase());
}

function parse_github_results(err, res, body) {
  try {
    if (res.statusCode !== 304) {
      var r = [].concat.apply([], JSON.parse(body)
        .filter(function (e) { return e.type === "PushEvent" })
        .map(function (e) {
          return e.payload.commits.filter(function (f) {
            return checkCommit(f.message);
          })
        }).filter(function (e) { return e.length > 0; }));
      for (i in r) {
        var commit = r[i].message;
        var owner = r[i].author.name;
        var tweet = commit + " ~ " + owner;
        if (last_tweets_queue.indexOf(tweet) < 0){ //New tweet
          bot.tweet(tweet);
          console.log("Tweeted: " + tweet);
          last_tweets_queue.push(tweet);
          if (last_tweets_queue.length > 10){
            last_tweets_queue.shift();
          }
        } else{ //Already in there, try again

        }
      }
    }
  } catch (e) {
    console.log("ERROR: " + e.message);
  }
  setTimeout(function () {
    request(options, parse_github_results);
  }, 5000);
}

request(options, parse_github_results);
