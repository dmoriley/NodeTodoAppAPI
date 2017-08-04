const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

//local
const {app} = require('../server/server');
const {Todo} = require('../models/todo');
const {User} = require('../models/user');

//dummy todos
const todos = [
    {
        text:'first test todo',
        _id: new ObjectId('59848551296b040614f00ecd')

    },
    {
        text:'second test todo',
        _id: new ObjectId('59848551296b040614f00ece')
    }
];


const users = [
    {email: 'david.m.oriley@hotmail.com', _id: new ObjectId('598484047ed52222541fdaab')},
    {email: 'david.m.oriley@gmail.com', _id: new ObjectId('59848551296b040614f00ecf')},
    {email: 'david.oriley@dcmail.ca',  _id: new ObjectId('59848551296b040614f00ed0')},
    {email: 'david_oriley@yahoo.ca',  _id: new ObjectId('59848551296b040614f00ed1')},
    {email: 'david.oriley@cgi.com',  _id: new ObjectId('59848551296b040614f00ed2')}
]
beforeEach((done) => { //before each test case clear the database of todos and add the dummys
    Todo.remove({}).then(() => {
       return Todo.insertMany(todos);
    }).then(() => {
       return User.remove({});
    }).then(() => {
       return User.insertMany(users);
    }).then(() => done());
});

// beforeEach((done) => { //before each test case clear the database of todos and add the dummys
//     Todo.remove({}).then(() => {
//        return User.remove({});
//     }).then(() => done());
// });

describe('POST/todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test';

        request(app) //supertest used to test the route functionality
            .post('/todos')
            .send({text}) //use es6 sytax to set object value
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text); //use expect library to check the response text is the same sent on the post
            })
            .end((err,res) => {
                if(err) {
                    return done(err); //returned to stop further execution, that way dont need else body
                }

                //now check database to see if the file was inserted 
                Todo.find({text}).then((todos) => { //using mongoose to query the database
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e)); //catch any errors (es6 arrow function expression syntax )

            });

    });

    it('should not create a todo with invalid body data', (done) => {

        request(app) //supertest request so send empty data
            .post('/todos') //send to todos route
            .send({}) //send nothing
            .expect(400)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                Todo.find().then((todos) => {
                        expect(todos.length).toBe(2);
                        done();
                }).catch((e) => done(e));
            });
    });



});

describe('GET/todos', () => {

    it('should get all the todos in the database', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });

    it('should get one todo from the database with id', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo).toExist();
                expect(res.body.todo._id).toEqual(todos[0]._id);
            })
            .end(done);
    });

});