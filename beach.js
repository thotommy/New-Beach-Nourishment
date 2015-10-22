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
    var data = generateOneStateData(state); //this is equivalent of results.php
    //version with all data to be displayed for the state returned in the object
    //assisnged to the variable data
    res.render('oneState', data); 
        //The first arugument is the name of the template file in the views
        //directory that will be the page displaying the information about the
        //state; that is, the file
        //views/oneState.handlebars
    
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

