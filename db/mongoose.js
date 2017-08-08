var mongoose = require('mongoose');

mongoose.Promise = global.Promise; //configure default promise for mongoose
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp'); //connect same way you would with the MongoClient
//process.env variable is to connect to the mongo database on heroku when it is deployed.
//used mLab app addon for the database
//to check the uri value from the cmd type: heroku config --app APP_NAME_HERE

module.exports = {
    mongoose
};