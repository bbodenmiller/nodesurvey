var mongoose = require('mongoose');
var twilio = require('twilio');
var config = require('../config');

// create an authenticated Twilio REST API client
var client = twilio(config.accountSid, config.authToken);

var VotesSchema = new mongoose.Schema({
    teamNumber: Number,
    teamName: String,
    votes: Number
});

var Votes = mongoose.model('Votes', VotesSchema);
module.exports = Votes;