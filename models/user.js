const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
    email : {
        required: true,
        trim: true,
        type: String,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail, //passing a function insteaad of creating our own
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type:String,
            required: true
        }
    }]
});

//.methods is where you add object/instance methods to the class/variable/thing(i dont know what its called in js)
UserSchema.methods.generateAuthToken = function() {  //arrow functions dont bind a this keyword, so need to use regular function
    var user = this; //this: the object calling the method
    var access = 'auth';                              //added access with es6  
    var token = jwt.sign({_id: user._id.toHexString(), access},'ballislife');

    user.tokens.push({access,token});

    //return the save promise so that it can be chained onto in another file, which will access the returned token as the success argument 
    //for the next then call
    return user.save().then(() => {
        return token;
    });
};

UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ['_id', 'email']);
};

var User = mongoose.model('User', UserSchema);

module.exports = {User};