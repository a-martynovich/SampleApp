var express = require('express'),
    mongodb = require('mongodb'),
    bodyParser = require('body-parser'),
    multer = require('multer');
var app = express();

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/', function(req, res, next) {
    console.log(req.body);
    res.send('Got a POST request');
});

app.listen(process.env.PORT, function () {
    console.log('App is listening!');

    mongodb.MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
        console.log('Mongo is connected!');
        if(err) throw err;
    });
});
