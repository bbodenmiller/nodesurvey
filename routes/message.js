var twilio = require('twilio');

var SurveyResponse = require('../models/SurveyResponse');
var survey = require('../survey_data');

var Votes = require('../models/Votes');
var Subscriber = require('../models/Subscriber');

// Handle SMS submissions
module.exports = function(request, response) {

    var phone = request.body.From;

    // respond with message TwiML content
    function respond(message) {
        var twiml = new twilio.TwimlResponse();
        twiml.message(message);
        response.type('text/xml');
        response.send(twiml.toString());
    }

    function addVote(teamNumber) {
        
        console.log('adding a vote for team ' + teamNumber);

        Votes.findOne({
            teamNumber: teamNumber
        }, function(err, team) {
            if (err) return respond('Derp! Technical issue updating vote count');

            if (!team) {
                // We're signed up but not subscribed - prompt to subscribe
                respond('Team ' + teamNumber + ' does not exist');
            } else {
                team.votes = team.votes + 1;
                team.save(function(err) {
                    if (err)
                        return respond('Derp! Technical issue updating vote count');
                });

            }
        });
    }

    function subtractVote(teamNumber) {

        console.log('subtracting a vote from team ' + teamNumber);

        Votes.findOne({
            teamNumber: teamNumber
        }, function(err, team) {
            if (err) return respond('Derp! Technical issue updating vote count');

            if (!team) {
                // We're signed up but not subscribed - prompt to subscribe
                respond('Team ' + teamNumber + ' does not exist');
            } else {
                team.votes = team.votes - 1;
                team.save(function(err) {
                    if (err)
                        return respond('Derp! Technical issue updating vote count');
                });
            }
        });
    }

    // Try to find a subscriber with the given phone number
    Subscriber.findOne({
        phone: phone
    }, function(err, sub) {
        if (err) return respond('Derp! Please text back again later.');

        if (!sub) {

            var teamNumber = getTeamNumber();

            // If there's no subscriber associated with this phone number,
            // create one
            var newSubscriber = new Subscriber({
                phone: phone,
                vote: teamNumber,
                body: request.body.Body
            });

            newSubscriber.save(function(err, newSub) {
                if (err || !newSub) 
                    return respond('We couldn\'t sign you up - try again.');

                addVote(teamNumber);
                var responseMessage = 'Team ' + teamNumber + ' thanks you for voting!';
                respond(responseMessage);
            });
        } else {
            // repeat vote from the same number
            processMessage(sub);
        }
    });

    // Process any message the user sent to us
    function processMessage(subscriber) {

        var currentVote = subscriber.vote;
        console.log('currentVote = ' + currentVote);

        var teamNumber = getTeamNumber();
        console.log('processMessage: teamNumber = ' + teamNumber);

        if (teamNumber == 0) {
            var responseMessage = 'Try again - please tell us the team number you want to vote for';
            return respond(responseMessage);
        }

        // save the entire message body for later use
        subscriber.body = request.body.Body;
        subscriber.vote = teamNumber;
        subscriber.save(function(err) {
            if (err)
                return respond('We could not cast your vote - please try again');
            
            // TODO: Update the team collection
            subtractVote(currentVote);
            addVote(teamNumber);

            // Otherwise, our subscription has been updated
            var responseMessage = 'Team ' + teamNumber + ' thanks you for voting!';
            respond(responseMessage);
        });
    }

    function getTeamNumber() {
        // get the text message command sent by the user
        var msg = request.body.Body || '';
        msg = msg.toLowerCase().trim();

        var allTheNumbers;
        var temp = msg.match(/^\d+|\d+\b|\d+(?=\w)/g);
        console.log('temp = ' + temp);

        if (temp === null && typeof temp === "object") {
            return 0;
        } else {
            allTheNumbers = temp.map(function (v) {return +v;});
            console.log('allTheNumbers = ' + allTheNumbers);            
        }

        console.log('first number found was ' + allTheNumbers[0]);
        return allTheNumbers[0];
    }

};