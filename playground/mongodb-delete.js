// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log('Unable to connect to MongoDB server', err);
    }

    console.log('Connected to MongoDB server');

    // db.collection('Todos').deleteMany({text: 'eat lunch'}).then((result) => {
    //     console.log(result);
    // });

    // db.collection('Todos').deleteOne({text: 'eat'}).then((res) => {
    //     console.log(res.result.n + " record(s) were deleted.");
    // }, (err) => {
    //     console.log("There was an error", err);
    // });

    db.collection('Todos').findOneAndDelete({text: 'eat'}).then((result) => {
        console.log(result);
    }, (err) => {
        console.log("There was an error", err);
    });

    

    //db.close();
});