// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

/*ES6 Object Destructuring, take a attribute of an object and assigning it to a variable
Ex.
var user = {name: 'david', age: 22};
var {name} = user;

Whats going on above is the name variable is taking the name attribute out of the user object and assigning the value to it.

*/



MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log('Unable to connect to MongoDB server', err);
    }

    console.log('Connected to MongoDB server');

    // db.collection('Todos').insertOne({
    //     text: 'Take out the trash',
    //     completed: false
    // }, (err, result) => {
    //     if(err) {
    //         return console.log('Unable to insert Todo', err);
    //     }

    //     console.log(JSON.stringify(result.ops,undefined,2));
    // });

    // db.collection('Users').insertOne({
    //     name: 'David O\'Riley',
    //     age: 22,
    //     location: 'Ajax'
    // }, (err, res) => {
    //     if(err) {
    //         return console.log('Unable to insert Todo', err);
    //     }

    //     console.log(JSON.stringify(res.ops,undefined,2));
    // });

    db.close();
});