var mongoose = require('mongoose');

mongoose.Promise = global.Promise; //configure default promise for mongoose
mongoose.connect('mongodb://localhost:27017/TodoApp'); //connect same way you would with the MongoClient

var Todo = mongoose.model('Todo', {
    text: {
        type: String
    },
    completed: {
        type: Boolean
    },
    completedAt: {
        type: Number
    }
});

var newTodo = new Todo({
    text: 'Drive home quickly',
    completed: 'false',
    completedAt: new Date().getDate()
});

saveDoc(newTodo);

// newTodo.save().then((doc) => {
//     console.log('Saved todo', doc);
// }, (err) => {
//     console.log('Unable to save todo', err);
// });

function saveDoc(theDoc) {
    theDoc.save().then((doc) => {
        console.log('Saved todo', doc);
    }, (err) => {
        console.log('Unable to save the todo', err);
    });
}