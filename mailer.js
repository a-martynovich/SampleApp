const   VERSION=3,
        api_key = 'key-6e1d76f1919c227f42fc2dd2b1669aa3',
        domain = 'sandboxcb66f7d6222f42c3975eb57280bba67a.mailgun.org';

var mongodb = require('mongodb'),
    mailgun = require('mailgun-js')({
        apiKey: api_key, 
        domain: domain
    });

console.log("Mailer is started");

mongodb.MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
    console.log('Mailer: Mongo is connected');
    if(err) throw err;

    var collection = db.collection('mailer');
    setInterval(function() {
        collection.find({sent: false, sending: false, version: VERSION}).each(function(err, msg) {
            if(msg==null)
                return;
            console.log("Unsent:");
            console.log(msg);
            msg.sending = true;
            collection.save(msg, function() {
                mailgun.messages().send({
                    from: msg.from,
                    to: msg.to,
                    subject: msg.subject,
                    text: msg.text
                }, function (error, body) {
                    if(error) {
                        console.error("error sending")
                        console.error(msg);
                        console.error(error);
                        // TODO: set attempts++
                    } else {
                        // TODO: set sent=true
                        console.log("mesage sent");
                        msg.sent = true;
                        msg.sending = false;
                        collection.save(msg);
                    }
                    console.log(body);
                });
            });
        });
    }, 1000);
});