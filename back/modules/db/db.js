
'use strict';

let db = null;

// Requirements
const
    // Mongo
    mongoClient = require('mongodb').MongoClient,
    config = require('./config.json'),
    // Error checking
    assert = require('assert');

// Authenticate & create a client
const {username, password, host, dbname} = config,
    url = `mongodb+srv://${username}:${password}@${host}/${dbname}/?retryWrites=true&w=majority`,
    client = new mongoClient(url, {useUnifiedTopology: true});

// Exported methods
// Connect to the database
exports.connect = (callback) => {
    client.connect((err) => {
        assert.equal(null, err);
        db = client.db(username);
        callback();
    });
};

// Return the database
exports.return = () => {
    return db;
};

// Close the database
exports.close = () => client.close();