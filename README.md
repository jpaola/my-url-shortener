# My URL Shortener

The goal of this project is to implement an HTTP API including the endpoints and methods. Clients can make an HTTP POST and the service returns a shortened version of the URL.

For example:

"https://www.playstation.com/en-us/ps5/"

becomes

"http://xyz.co/abcd"

When the clients make a GET request to the shortened URL, the HTTP response redirects them to the full URL.

## Setup
To run this script, you will need node, npm, and express.

Install and use latest node version and npm - https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

Install express - https://expressjs.com/en/starter/installing.html

## Running my-url-shortener.js
To run the javascript file run the following command:

```bash
node my-url-shortener.js
```

## Endpoints

GET /api/v1/:{id}
POST /api/v1/shorten

## Making API calls
While running the server, you can send requests using curl.

```bash
curl 'http://localhost:3000/api/v1/:{id}'
```

and

```bash
curl -xPOST -d 'https://www.playstation.com/en-us/ps5/' 'http://localhost:3000/api/v1/shorten'
```

where "https://www.playstation.com/en-us/ps5/" is the long URL to be shortened.