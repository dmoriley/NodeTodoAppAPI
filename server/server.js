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


app.listen(port, () => {
    console.log('Started on port 3000');
});

module.exports = {app};

