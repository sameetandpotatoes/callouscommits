Installation
=========

1. Clone this repository
2. `touch settings.js`
3. Open up settings.js and fill in with all of your credentials. You need a Twitter account to generate your consumer key, secret, access token, and access token secret.
4. (Optional): You could also get a GitHub token for more api requests. You don't have to do, though, because the api used to retrieve these commits doesn't require a GitHub token, but it is recommended to get a higher rate limit.
4. `npm install` and `node app.js`.

Configuration
============

- All of the variables you can change are in the settings.js, mainly the yes words and no words.
- This bot does post fairly frequently, so you can change that with the setTimeout method in the
`parse_github_results` method

URL (Example)
=========
http://www.twitter.com/callouscommits
