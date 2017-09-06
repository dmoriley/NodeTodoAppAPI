const mongoose = require('mongoose');

mongoose.Promise = global.Promise; //configure default promise for mongoose
// console.log(process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI);
//process.env variable is to connect to the mongo database on heroku when it is deployed.
//used mLab app addon for the database


module.exports = {
    mongoose
};