'use strict';

// Requirements
const
    // NPM
    // Express
    express = require('express'),
    app = express(),
    expressPort = 3000,
    router = express.Router(),
    // Allow Express to access local files
    path = require('path'),
    // Extract JSON from HTTP response
    bodyParser = require('body-parser'),
    // Error checking
    assert = require('assert'),
    
    // Local modules
    // Database
    db = require('./modules/db/db.js'),
    // Twitter
    twitter = require('./modules/twitter/twitter.js');
    
// Setup
// Enable body parser
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// Approve cross-origin requests
app.use((req, res, callback) =>  {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    callback();
});

// Connect to the database
db.connect(() => {
    console.log("Database connection success.")
    app.listen(expressPort, () =>
        console.log(`At your service. Listening on port ${expressPort}.`)
    );
});

// Classes
class User {
    constructor(username, password) {

        this.username = username;
        this.password = password;

    }

    print(){
        console.log(this);
    }
}



// Routes
// Root (home)
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname + '/index.html'))
);



// getArticles
app.get('/getArticles', (req, res) => {
    console.log("/getArticles")

    // Define collection
    const collection = db.return().collection('Articles');

    // Find
    collection.find({}).toArray(function(err, results) {
        assert.equal(err, null);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(results));
    });
});



// getTrends
app.get('/getTrends', (req, res) => {
    console.log("/getTrends");

    twitter.getTrends(() => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(twitter.return()));
    });
});



// saveArticle
app.post('/saveArticle', (req, res) => {
    console.log("/saveArticle")
    
    const {username, password, ...article} = req.body;
    let userExists = false,
        passwordCorrect = false;
    
    // Find
    let collection = db.return().collection("Users");
    collection.find({}).toArray(function(err, results) {
        assert.equal(err, null);

        for (const user of results) {

            if (username === user.username) {
                
                userExists = true;

                if (password === user.password) {

                    passwordCorrect = true;

                    // Check if article already exists, overwrite if so
                    collection = db.return().collection("Articles");
                    collection.find({}).toArray(function(err, articles) {
                        assert.equal(err, null);

                        for (const existingArticle of articles) {

                            if (article.headline === existingArticle.headline) {

                                console.log("Existing article deleted.")
                                collection.deleteOne(existingArticle);
                                break;

                            }
                        }
                    });

                    // Save
                    collection.insertOne(
                        article,
                        function(err, result) {
                            assert.equal(err, null);
                            assert.equal(1, result.result.n);
                            assert.equal(1, result.ops.length);
                            console.log(`${result.result.n} document inserted into the collection.`);
                            res.send(result);
                        }
                    );

                    break;

                };
            }
        };

        if (!userExists) {

            console.log("Username fail");
            res.statusMessage = "No such user.";
            res.status(400).end();

        } else if (!passwordCorrect) {

            console.log("Password fail");
            res.statusMessage = "Incorrect password.";
            res.status(400).end();

        }
    })
});



// saveUser
app.post('/saveUser', (req, res) => {
    console.log("/saveUser")
    
    const {username, password1, password2} = req.body;
    let userExists = false;

    // Find
    let collection = db.return().collection("Users");
    collection.find({}).toArray(function(err, users) {
        assert.equal(err, null);

        for (const existingUser of users) {

            if (username === existingUser.username) {

                console.log("User registration fail.")
                res.statusMessage = "User already exists.";
                res.status(400).end();
                userExists = true;
                break;

            }
        }

        if (!userExists) {

            const newUser = new User(username, password1);
            newUser.print();

            // Save
            collection.insertOne(
                newUser,
                function(err, result) {
                    assert.equal(err, null);
                    assert.equal(1, result.result.n);
                    assert.equal(1, result.ops.length);
                    console.log(`${result.result.n} document inserted into the collection.`);
                    res.send(result);
                }
            );
        }
    });
});