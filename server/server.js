const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const port = process.env.PORT || 3000;


//local imports
require('../db/config/config'); //need config first
var {mongoose} = require('../db/mongoose');
var {Todo} = require('../models/todo');
var {User} = require('../models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();

app.use(bodyParser.json());// use this to send json to express application

app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.post('/users',(req,res) => {
    var body = _.pick(req.body,['email','password']);
    var user = new User({
        email: body.email,
        password: body.password
    });

    user.save().then(() => {
        return user.generateAuthToken(); //returns a promise with token as its return
    }).then((token) => {  //token the return of the promise from generateAuthToken
        //x- prefix in header is how to create CUSTOM header for own purposes
        res.header('x-auth',token).send(user); //sending user after new token added
    }).catch((e) => {
        res.status(400).send({errorMessage: 'INVALID_USER_INFORMATION', error:e});
    })
});

app.post('/users/login', (req,res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email,body.password).then((user) => {
        user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send(e);
    });
});

//validates user against the authenticate middleware first
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});


app.get('/todos', authenticate, (req, res) => {
    // console.log(req.query);  //to get all the parameters passed in the url with the ?id=123 method
    Todo.find({_creator: req.user._id}).then((todos) => {
        res.status(200).send({todos}); //better to send a object back (es6 style) so you can attach things to it if necessary
    }, (err) => {
        console.log('Unable to connect to database\n',err);
    });

});



//colon followed by a name (:id) is knows as a url parameter used to pass parameters. Guess you could also use the ?id=123 but who knows
app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;

    if(!ObjectId.isValid(id)) { //check is valid object id
        return res.status(404).send({error: 'INVALID_ID'})
    }

    Todo.findOne({
        _id:id,
        _creator: req.user._id
    }).then((todo) => {
        if(!todo) { //check if the todo exists
            return res.status(404).send({error: 'TODO_DOESNT_EXIST'})
        }

        res.status(200).send({todo}); //send the todo
    }).catch((e) => {
        res.status(400).send();
    });
});  

//delete a todo by id
app.delete('/todos/:id',authenticate, (req, res) => {
    var id = req.params.id;
    if(!ObjectId.isValid(id)) {
        return res.status(400).send({error: 'INVALID_ID'});
    }

    Todo.findOneAndRemove({
        _id:id,
        _creator:req.user._id
    }).then((todo) => {
        if(!todo) { //check if todo is null, meaning that there wasnt a todo to delete
            return res.status(404).send({error: 'TODO_DOSENT_EXIST'});
        }

        //otherwise continue 
        res.send({result: 'DOCUMENT_REMOVED',todo});

    }).catch((err) => {
        res.status(400).send({error: 'UNKNOWN_ERROR', errObj: err});
    });
});

app.delete('/users/me/token',authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});

app.patch('/todos/:id',authenticate, (req, res) => {
    var id = req.params.id;
    //lodash pick method will seach a object/array for the supplied arguments. This will limit updating the 
    //requested object with things we dont want added or that the user is not allowed to update
    var body = _.pick(req.body, ['text','completed']);

    if(!ObjectId.isValid(id)) {
        return res.status(400).send({error: 'INVALID_ID'});
    }

    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    }
    else {
        body.completed = false;
        body.completedAt = null; //clear field from database
    }
                                                //same as return original from MongoDBClient
    Todo.findOneAndUpdate({_id:id,_creator:req.user._id}, {$set: body}, {new: true}).then((todo) => {
        if(!todo) { //check if todo is null, meaning that there wasnt a todo to update
            return res.status(404).send({error: 'TODO_DOSENT_EXIST'});
        }

        res.send({message: 'DOCUMENT_UPDATED', todo})
    }).catch((e) => {
        res.status(400).send({error: 'UNKNOWN_ERROR', errObj: err});
    });
});


app.listen(port, () => {
    console.log('Started on port', port);
});

module.exports = {app};

