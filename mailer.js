var mongodb = require('mongodb');

console.log("Mailer is started");

mongodb.MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
    console.log('Mailer: Mongo is connected!');
    if(err) throw err;
});