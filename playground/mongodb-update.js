// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log('Unable to connect to MongoDB server', err);
    }

    console.log('Connected to MongoDB server');


    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('597a25d6f4021f6ef01648bc')
    // },{
    //     $set: {
    //         completed: true
    //   }
    // }, {
    //     returnOriginal: false 
    // }).then((result) => {
    //     console.log(result);
    // }, (err) => {
    //     console.log("There was an error.", err);
    // });

    db.collection('Users').findOneAndUpdate(
        {_id: new ObjectID('597a2c9bf4021f6ef0164a73')},
        {
            $inc: {age: 1},
            $set: {location: 'North York'}
        },
        {returnOriginal: false}
    ).then((res) => {
        console.log('Success\n',res);
    }, (err) => {
        console.log('There was an error.', err);
    });

    //db.close();
});