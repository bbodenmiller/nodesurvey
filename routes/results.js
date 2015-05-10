var Votes = require('../models/Votes');

// Grab the latest votes data for display in a quick and dirty UI
module.exports = function(request, response) {

    Votes.find({

    }).exec(function(err, docs) {
        if (err) {
            respone.status(500).send(err);
        } else {
            response.send({
                results: docs
            });
        }
    });
};