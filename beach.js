/**
 * This is the main file for the beach nourishment website
 *
 */
var express = require('express');
var app = express();

/*Sets up the handlebars for the beach app*/
var handlebars = require('express3-handlebars')
    .create({ defaultLayout: 'main' });

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

/*This line will make all static items in public visible to users*/
app.use(express.static(__dirname + '/public'));

app.set('port', process.env.PORT || 3000);


app.get('/', function(req,res) {
    res.render('home');
});


app.get('/oneState', function(req,res) {
    var state = req.query.state; //get the state from the query string
    var data = generateOneStateData(state);
    res.render('oneState', { data: data });     
});
 

/*404 catch-all handler (middleware)*/
app.use(function(req,res,next) {
    res.status(404);
    res.render('404');
});

/*500 error handler (middleware*/
app.use(function(req,res,next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function() {
    console.log('Server starts on http://localhost:' +
                app.get('port') + '; press Ctrl-C to terminate.');
});


function generateOneStateData(current_state) {
	var fullStateName = "";
	if (current_state == "AL") {
        fullStateName = "Alabama";
    } else if (current_state == "CA") {
        fullStateName = "California";
    } else if (current_state == "CN") {
        fullStateName = "Connecticut";
    } else if (current_state == "DE") {
        fullStateName = "Delaware";
    } else if (current_state == "GA") {
        fullStateName = "Georgia";
    } else if (current_state == "LA") {
        fullStateName = "Louisiana";
    } else if (current_state == "MA") {
        fullStateName = "Massachusetts";
    } else if (current_state == "MD") {
        fullStateName = "Maryland";
    } else if (current_state == "ME") {
        fullStateName = "Maine";
    } else if (current_state == "MS") {
        fullStateName = "Mississipi";
    } else if (current_state == "NC") {
        fullStateName = "North Carolina";
    } else if (current_state == "NJ") {
        fullStateName = "New Jersey";
    } else if (current_state == "RI") {
        fullStateName = "Rhode Island";
    } else if (current_state == "SC") {
        fullStateName = "South Carolina";
    } else if (current_state == "TX") {
        fullStateName = "Texas";
    } else if (current_state == "VA") {
        fullStateName = "Virginia";
    } else if (current_state == "WA") {
        fullStateName = "Washington";
    }
	return fullStateName;
};

