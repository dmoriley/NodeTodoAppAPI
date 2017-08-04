const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');

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
    // console.log(req.query);  //to get all the parameters passed in the url with the ?id=123 method
    Todo.find().then((todos) => {
        res.status(200).send({todos}); //better to send a object back (es6 style) so you can attach things to it if necessary
    }, (err) => {
        console.log('Unable to connect to database\n',err);
    });

});

//colon followed by a name (:id) is knows as a url parameter used to pass parameters. Guess you could also use the ?id=123 but who knows
app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    if(!ObjectId.isValid(id)) { //check is valid object id
        return res.status(404).send({error: 'INVALID_ID'})
    }

    Todo.findById(id).then((todo) => {
        if(!todo) { //check if the todo exists
            return res.status(404).send({error: 'TODO_DOESNT_EXIST'})
        }

        res.status(200).send({todo}); //send the todo
    }).catch((e) => {
        res.status(400).send();
    });
})  


app.listen(port, () => {
    console.log('Started on port', port);
});

module.exports = {app};

