import express from "express";

/*
url dictionary. 
{
    'primaryKey': {
        longUrl: string,
        shortUrl: string,
    }
}
...
*/
let urlDictionary = {};
let server = express();

/****************************************
 *                 SERVER 
 ****************************************/
server.use(
    express.urlencoded({
        extended: true, // <==== Makes it possible to extract the URL from the request body
    })
);
server.use(express.json())    // <==== parse request body as JSON
server.listen(3000, () => {
    console.log("Server running on port 3000");
});

/**
 * Receives a shortened URL and returns the longUrl pertaining to it.
 */
server.get("/api/v1/:id", (req, res, next) => {
    Promise.resolve().then(() => {
        getUrl(req.params.id, res);
        console.log("My url dictionary: ", urlDictionary);
    }).catch(next) // Errors will be passed to Express.
});

/**
 * Shortens a URL and saves it in the url dictionary.
 */
server.post("/api/v1/shorten", (req, res, next) => {
    Promise.resolve().then(() => {
        convertToShortURL(req.body.url, res);
        console.log("My url dictionary: ", urlDictionary);
    }).catch(next) // Errors will be passed to Express.
});
/*****************************************/


/**
 * Creates a shortened URL with a unique ID.
 * @param {*} id String
 * @returns A shortened URL
 */
function convertToShortURL(longUrl, res) {
    if (!isValidURL(longUrl)) {
        // Bad request
        res.sendStatus(400);
    } else {
        // Check if the longUrl isn't already in the dictionary
        let urlAlreadyInDictionary = false;
        
        for (const prop in urlDictionary) {
            if (urlDictionary[prop].longUrl === longUrl) {
                urlAlreadyInDictionary = true;
                break;
            }
        }

        // create shortUrl, generate unique ID and add this along the longURL if it's not yet in the dictionary
        if (!urlAlreadyInDictionary) {
            const primaryKey = generateId();
            const shortUrl = `http://do.co/${primaryKey}`;
            urlDictionary[primaryKey] = {
                longUrl,
                shortUrl,
            };
        }

        // OK
        res.sendStatus(200);
    }
}

/**
 * Redirects to the original URL.
 */
function getUrl(id, res) {
    if (!urlDictionary[id]) {
        // Bad Request
        res.sendStatus(400);
    } else {
        res.redirect(urlDictionary[id].longUrl);
    }
}

/**
 * Generates an ID 10 characters long.
 * NOTE: To avoid collisions use base 62 unique ID.
 * References: https://stackoverflow.com/questions/30468292/
 * how-to-generate-base62-uuids-in-node-js
 * @returns An ID
 */
function generateId() {
    let uniqueIdentifier = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    // Number of characters for each generated uniqueId, i.e. length of the generated id
    const length = 10;

    for (var i = 0; i < length; i++) {
        uniqueIdentifier += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return uniqueIdentifier;
}

/**
 * Validate URL.
 * @param {} url String
 * @returns True if the URL is a valida URL, otherwise returns False
 */
function isValidURL(url) {
    let pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(url);
}
