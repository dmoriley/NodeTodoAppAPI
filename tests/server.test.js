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
        _id: new ObjectId()

    },
    {
        text:'second test todo',
        _id: new ObjectId()
    }
];


const users = [
    {email: 'david.m.oriley@hotmail.com', _id: new ObjectId()},
    {email: 'david.m.oriley@gmail.com', _id: new ObjectId()},
    {email: 'david.oriley@dcmail.ca',  _id: new ObjectId()},
    {email: 'david_oriley@yahoo.ca',  _id: new ObjectId()},
    {email: 'david.oriley@cgi.com',  _id: new ObjectId()}
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

});

describe('GET /todos/:id', () => {

    it('should get one todo from the database with id', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo).toExist();
                expect(res.body.todo.text).toEqual(todos[0].text);
            })
            .end(done);
    });

    it('should respond with a 404 because id is not in database', (done) => {
        request(app)
            .get(`/todos/${new ObjectId().toHexString()}`)
            .expect(404)
            .expect((res) => {
                expect(res.body.error).toBe('TODO_DOESNT_EXIST');
            })
            .end(done);
    });

    it('should respond with 404 because the id is invalid', (done) => {
        request(app)
            .get('/todos/123')
            .expect(404)
            .expect((res) => {
                expect(res.body.error).toBe('INVALID_ID');
            })
            .end(done);
    });

});

describe('DELETE todos/:id', () => {

    it('should delete one todo from the database', (done) => {
        var hexId = todos[0]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toEqual(hexId);
            })
            .end((err, res) => { //this is asyc because the stuff in end can execute while the next it('should...) executes
                if(err) {
                    return done(err);
                }

                //now that it has been deleted from database test that it no longer exists in the database
                Todo.findById(hexId).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should respond with 404 because todo doenst exist', (done) => {
        request(app)
            .delete(`/todos/${new ObjectId().toHexString()}`)
            .expect(404)
            .expect((res) => {
                expect(res.body.error).toBe('TODO_DOSENT_EXIST');
            })
            .end(done);
    });

    it('should respond with 400 because invalid object id', (done) => {
        request(app)
            .delete('/todos/123')
            .expect(400)
            .expect((res) => {
                expect(res.body.error).toBe('INVALID_ID');
            })
            .end(done);
    });


});