const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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
    var token = jwt.sign({_id: user._id.toHexString(), access},process.env.JWT_SECRET);

    user.tokens.push({access,token});

    //return the save promise so that it can be chained onto in another file, which will access the returned token as the success argument 
    //for the next then call
    return user.save().then(() => {
        return token;
    });
};

UserSchema.methods.removeToken = function(token) {
    var user = this;

    return user.update({
        $pull: {
            tokens: {token}
        }
    })
};

//.statics lets you create class methods
UserSchema.statics.findByToken = function(token) {
    var User = this;  //the class/model is the this
    var decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch(e) {
        return Promise.reject();
    }

    //returning function for promise chaining somewhere else
    return User.findOne({
        _id: decoded._id,
        'tokens.token':token, //quotes needed when there is a period in the value
        'tokens.access':decoded.access
    });
};

UserSchema.statics.findByCredentials = function(email,password) {
    var User = this;

    return User.findOne({email}).then((user) => {
        if(!user) {
            return Promise.reject({error: "USER_DOESNT_EXIST"}); //triggers catch black in whatever is handling the function somwhere else
        }
        //return new promise because bcrypt only supports callbacks, not promise so have to make our own
        return new Promise((resolve, reject) => {
            bcrypt.compare(password,user.password, (err, res) => {
                if(!res) {
                    reject({error: "INCORRECT_PASSWORD"});
                }
                resolve(user);
            });
        });
    });
};

//overriding the toJSON method so that it only shows the id and email and not the password and tokens data
UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ['_id', 'email']);
};

//pre is a middleware built into mongoose, designating something to occur because the event specified in the first argument
UserSchema.pre('save', function(next) {
    var user = this;

    if(user.isModified('password')) {
        bcrypt.genSalt(10, (err,salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};