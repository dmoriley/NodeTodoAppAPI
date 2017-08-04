const {mongoose} = require('../db/mongoose');
const {Todo} = require('../models/todo');
const {ObjectId} = require('mongodb');
const {User} = require('../models/user');

var id = '5983713066cab1150c274876';

if(!ObjectId.isValid(id)) {
    console.log('ID not valid');
}

// Todo.find({ //even thou only going to get one result, the object will be inside an array
//     _id: id  //mongoose will take the string id and convert to object id for us 
// }).then((todos) => {
//     console.log('Todos',todos);
// });

// Todo.findOne({  //findOne will return one object and not an array
//     _id: id  
// }).then((todos) => {
//     console.log('FindOne Todos',todos);
// });

Todo.findById(id).then((todos) => {
    if(!todos) {  //if valid id structure but id not in database will fire success case so this handles if id doesnt exist
        return console.log('Id not found');
    }
    console.log('FindByID Todos',todos);
}).catch((e) => {
    console.log(e);
}); //only can query by id, same as above but easier to write


var userId = '597f35b1b0c8750e5c96b392';

if(!ObjectId.isValid(userId)) {
    console.log('Invalid User Id');
}

User.findById(userId).then((theUser) => {
    if(!theUser) {
        return console.log('User not found in database');
    }
    console.log('User is:\n', theUser);
}).catch((e) => console.log(e));