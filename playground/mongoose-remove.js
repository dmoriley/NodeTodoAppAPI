const {mongoose} = require('../db/mongoose');
const {Todo} = require('../models/todo');
const {ObjectId} = require('mongodb');
const {User} = require('../models/user');

// the empty {} will remove everything
// Todo.remove({}).then((result) => {
//     console.log(result);
// });

//going to find the first document and return it so you can do something with the returned data
Todo.findOneAndRemove({_id: '5989ade78e9831101614fde6'}).then((todo) => {
    console.log(todo);
});

//will return the document as well
// Todo.findByIdAndRemove('5989ade78e9831101614fde6').then((todo) => {
//     console.log(todo);
// });
