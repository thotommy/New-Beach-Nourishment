/**
 * This is the file which implements the server part of the
 * Beach Nourishment Project as well as the heart of
 * the implementation with Node and express
 */

/*
 * Sets up the Express framework for the beach app
 */
var express = require('express');
var app = express();

/*
 * Sets up the handlebars for the beach app and designates main.handlebars
 * to be the layout page for handlebars which is a templating library
 */
var handlebars = require('express3-handlebars')
    .create({ defaultLayout: 'main' });

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');


/*
 * This allows everything that is in the public folder to be seen
 * everything that is in this folder will be used if its a static element
 */
app.use(express.static('public'));

/*
 *Sets the app to be listening in port 3000
 */
app.set('port', process.env.PORT || 3000);

/**
 * This is the GET request and route for the home page
 */
app.get('/', function(req,res) {
    res.render('home');
});

/**
 * This is the GET request and route for the results page
 */
app.get('/oneState', function(req,res) {
    var state = req.query.state; //get the state from the query string
    var fullStateName = generateOneStateData(state);
    res.render('oneState', { state: state, fullStateName: fullStateName });
});

/*
 * This is the GET request and route for the visuals page
 */
app.get('/visual', function (req,res) {
    var state = req.query.state; //get the state from the query string
    var beach = req.query.beach; //Get the beach from the query string
    res.render('visual', {state: state, beach: beach});
});

/*
 * This is the GET request and route for the beach tables page
 */
app.get('/beachtables', function (req,res) {
    var state = req.query.state; //get the state from the query string
    var beach = req.query.beach; //Get the beach from the query string
    res.render('beachtables', {state: state, beach: beach});
});

/*
 * This is the GET request and route for the about page
 */
app.get('/about', function(req,res) {
    res.render('about');
});

/*404 catch-all handler (middleware)*/
app.use(function(req,res) {
    res.status(404);
    res.render('404');
});

/*500 error handler (middleware*/
app.use(function(req,res,next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

/*
 * This will actually allow the app to actually do the listening
 * for the specific port 3000 as well as tells you, you are
 * listening to it
 */
app.listen(app.get('port'), function() {
    console.log('Server starts on http://localhost:' +
                app.get('port') + '; press Ctrl-C to terminate.');
});

/*
 * This function allows the full state name to be generated whenever
 * the state abbrev. is generated in the query string
 */
function generateOneStateData(current_state) {
	var fullStateName = "";
	if (current_state == "AL") {
        fullStateName = "Alabama";
    } else if (current_state == "CA") {
        fullStateName = "California";
    } else if (current_state == "CT") {
        fullStateName = "Connecticut";
    } else if (current_state == "DE") {
        fullStateName = "Delaware";
    } else if (current_state =="FL") {
	fullStateName = "Florida";
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
    } else if (current_state == "NH") {
	fullStateName = "New Hampshire";
    } else if (current_state == "NY") {
	fullStateName = "New York";
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
