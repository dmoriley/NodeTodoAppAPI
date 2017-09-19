const {ObjectId} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('../../models/todo');
const {User} = require('../../models/user');

const userOneId = new ObjectId();
const userTwoId = new ObjectId();

var users = [
    {
        email: 'david.m.oriley@hotmail.com', 
        _id: userOneId,
        password: 'userOnePassword',
        tokens: [{
            access: 'auth',
            token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
        }]
    }, {
        email: 'david_oriley@yahoo.ca', 
        _id: userTwoId,
        password: 'userTwoPassword',
        tokens: [{
            access: 'auth',
            token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
        }]
    }
]
//dummy todos
var todos = [
    {
        text:'first test todo',
        _id: new ObjectId(),
        _creator: userOneId

    },
    {
        text:'second test todo',
        _id: new ObjectId(),
        completed: true,
        completedAt: 343,
        _creator: userTwoId
    }
];

var populateTodos = (done) => { //before each test case clear the database of todos and add the dummys
    Todo.remove({}).then(() => {
       return Todo.insertMany(todos);
    }).then(() => done());
};

var populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        //wait till all provided promises are successful then continue
        return Promise.all([userOne,userTwo]);
    }).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};