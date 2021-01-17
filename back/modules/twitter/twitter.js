"use strict";

let trends = null;

// Requirements
const
	locations = require("./locations.json"),
	twitter = require("twitter"),
	config = require("./config.json"),
	client = new twitter(config),
	// Error checking
	assert = require('assert');

// Define the location for nearby trends (Edinburgh)
const coordinates = locations.edinburgh;
let woe = {};

// Get & return trends in given location
exports.getTrends = (callback) => {

    // Get the appropriate WOEID (Yahoo! Where On Earth ID) to pass to Twitter
    client.get("trends/closest", coordinates, (err, result) => {

        woe = {
            id: result[0].woeid
        };

		console.log(result[0]);
        trendsPlace();
    });

    // Get the trends for the WOEID
    function trendsPlace() {
        client.get('trends/place', woe, (err, results) => {
            assert.equal(err, null);
            trends = results[0].trends;
            callback();
        });
    };
};

// Return the trends
exports.return = () => {
    return trends;
}

