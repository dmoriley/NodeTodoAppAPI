var mongoose = require('mongoose');

mongoose.Promise = global.Promise; //configure default promise for mongoose
mongoose.connect('mongodb://localhost:27017/TodoApp'); //connect same way you would with the MongoClient

module.exports = {
    mongoose
};