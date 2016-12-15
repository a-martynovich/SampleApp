console.log("Web is started");
const VERSION=3;

var express = require('express'),
    mongodb = require('mongodb'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    child_process = require('child_process');
var app = express();

app.use(express.static('public'));
app.use(bodyParser.json());

app.listen(process.env.PORT, function () {
    console.log('Web: listening');

    mongodb.MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
        console.log('Web: Mongo is connected');
        if(err) throw err;

        app.post('/', function(req, res, next) {
            console.log(req.body);
            var record = req.body;
            record.sent = false;
            record.attempts = 0;
            record.version = VERSION;
            record.sending = false;

            db.collection('mailer').insert(req.body, function(err, result) {
                if(err) {
                    console.error(err);
                }
                res.send(JSON.stringify({
                    success: (err==null)
                }));
            })
        });

    });
});
