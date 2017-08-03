const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;


//local imports
var {mongoose} = require('../db/mongoose');
var {Todo} = require('../models/todo');
var {User} = require('../models/user');

var app = express();

app.use(bodyParser.json());// use this to send json to express application

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', (req, res) => {
    // console.log(req.query);  //to get all the parameters passed in the url
    Todo.find().then((todos) => {
        res.status(200).send({todos}); //better to send a object back (es6 style) so you can attach things to it if necessary
    }, (err) => {
        console.log('Unable to connect to database\n',err);
    });

});


app.listen(port, () => {
    console.log('Started on port', port);
});

module.exports = {app};

