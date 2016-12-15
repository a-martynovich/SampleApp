"use strict";

console.log("Mailer is started");

const   VERSION=3,
        MAX_ATTEMPTS=3,
        MONGO_COLLECTION='mailer',
        MAILGUN_API_KEY = 'key-6e1d76f1919c227f42fc2dd2b1669aa3',
        MAILGUN_DOMAIN = 'sandboxcb66f7d6222f42c3975eb57280bba67a.mailgun.org';

var mongodb = require('mongodb'),
    mailgun = require('mailgun-js')({
        apiKey: MAILGUN_API_KEY,
        domain: MAILGUN_DOMAIN
    });

mongodb.MongoClient.connect(process.env.MONGODB_URI, (err, db) => {
    console.log('Mailer: Mongo is connected');
    if(err) throw err;

    let collection = db.collection(MONGO_COLLECTION);
    setInterval(function() {
        collection.find({
            sent: false,
            sending: false,
            version: VERSION,
            attempts: {$lt: MAX_ATTEMPTS}})
        .each((err, msg) => {
            if(msg==null)
                return;
            console.log("Unsent:");
            console.log(msg);
            msg.sending = true;
            collection.save(msg, () => {
                mailgun.messages().send({
                    from: msg.from,
                    to: msg.to,
                    subject: msg.subject,
                    text: msg.text
                }, (error, body) => {
                    if(error) {
                        console.error("error sending")
                        console.error(msg);
                        console.error(error);
                        msg.sent = false;
                        msg.sending = false;
                        msg.attempts++;
                        if(msg.attempts == MAX_ATTEMPTS) {
                            console.error('max attempts reached');
                        }
                    } else {
                        console.log("mesage sent");
                        msg.sent = true;
                        msg.sending = false;
                    }
                    collection.save(msg);
                    console.log(body);
                });
            });
        });
    }, 1000);
});