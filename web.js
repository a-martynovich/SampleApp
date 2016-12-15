console.log("Web is started");

var express = require('express'),
    mongodb = require('mongodb'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    child_process = require('child_process');
var app = express();

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/', function(req, res, next) {
    console.log(req.body);
    res.send(JSON.stringify({
        success: true
    }));
});

app.listen(process.env.PORT, function () {
    console.log('Web: listening');

    mongodb.MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
        console.log('Web: Mongo is connected');
        if(err) throw err;
    });
});
