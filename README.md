Installation
=========

1. Clone this repository
2. `touch settings.js`
3. Open up settings.js, copy the below template, and fill in with your Twitter developer credentials.
4. `npm install`.


> exports.twitterAccess = {

>  "consumer_key": '',

>  "consumer_secret": '',

> "access_token": '',

> "access_token_secret": ''

> };

> exports.githubToken = "";

> exports.screenName = "";

> exports.yes_words = ["word1", "word2"];

> exports.no_words = ["merge", "branch", "master"];

Configuration
============

- All of the variables you can change are in the settings.js, mainly the yes words and no words.
- This bot does post fairly frequently, so you can change that with the setTimeout method in the
`parse_github_results` method

URL
=========
http://www.twitter.com/callouscommits
