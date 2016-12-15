"use strict";

console.log("Web is started");

const VERSION=3,
      MONGO_COLLECTION='mailer';

var express = require('express'),
    mongodb = require('mongodb'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    child_process = require('child_process');
var app = express();

app
    .use(express.static('public'))
    .use(bodyParser.json())
    .listen(process.env.PORT, () => {
        console.log('Web: listening');

        mongodb.MongoClient.connect(process.env.MONGODB_URI, (err, db) => {
            console.log('Web: Mongo is connected');
            if(err) throw err;

            app.post('/', function(req, res, next) {
                console.log(req.body);
                var record = Object.assign(req.body, {
                    sent : false,
                    attempts : 0,
                    version : VERSION,
                    sending : false
                });

                db.collection(MONGO_COLLECTION).insert(req.body, (err, result) => {
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
