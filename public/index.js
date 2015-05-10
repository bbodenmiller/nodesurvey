$(function() {

    function votes(teams) {

        var ctx = document.getElementById('voteChart').getContext('2d');

        var teamNames = [];
        var votes = [];

        for (var i in teams) {
          console.log(teams[i].teamName);
          teamNames.push(teams[i].teamName);
          votes.push(teams[i].votes);
        }

        var data = {
            labels: teamNames,
            datasets: [
                {
                    label: "votes",
                    fillColor: "rgba(220,220,220,0.5",
                    data: votes
                }
            ]
        }

        var options = {
            scaleShowGridLines : true,
            //String - Colour of the grid lines
            scaleGridLineColor : "rgba(0,0,0,.05)",
        }

        var voteChart = new Chart(ctx).Bar(data, options);

    }

    // Load current results from server
    $.ajax({
        url: '/results',
        method: 'GET'
    }).done(function(data) {
        // Update charts and tables
        votes(data.results);
    }).fail(function(err) {
        console.log(err);
        alert('failed to load results data :(');
    });
});