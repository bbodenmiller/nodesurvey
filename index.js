var http = require('http');
var path = require('path');
var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var urlencoded = require('body-parser').urlencoded;
var config = require('./config');
var voice = require('./routes/voice');
var message = require('./routes/message');
var results = require('./routes/results');

// initialize MongoDB connection
mongoose.connect(config.mongoUrl);

// TODO: popualte the Votes collection first!
var teamNames = [
	"Alpha",
	"Bravo",
	"Charlie",
	"Delta",
	"Echo",
	"Foxtrot",
	"Golf",
	"Hotel",
	"India",
	"Juliet"
];

var Votes = require('./models/Votes');
Votes.remove({}, function(err) { 
   console.log('votes collection removed') 
});

for (var i in teamNames) {

	var teamNumber = parseInt(i, 10) + 1;
	console.log('teamNumber = ' + teamNumber);

	var votes = new Votes({
		teamNumber: teamNumber,
		teamName: teamNames[i],
		votes: 0
	});

	votes.save(function(err, newSub) {
    	if (err || !newSub) 
        	console.log('Could not create votes document');
	});
}

// Create Express web app with some useful middleware
var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(urlencoded({ extended: true }));
app.use(morgan('combined'));

// Twilio Webhook routes
app.post('/voice', voice.interview);
app.post('/voice/:responseId/transcribe/:questionIndex', voice.transcription);
app.post('/message', message);

// Ajax route to aggregate response data for the UI
app.get('/results', results);

// Create HTTP server and mount Express app
var server = http.createServer(app);
server.listen(config.port, function() {
    console.log('Express server started on *:'+config.port);
});

console.log("MongoURI: " +config.mongoUrl);