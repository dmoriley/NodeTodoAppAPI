const expect = require('expect');
const request = require('supertest');

//local
const {app} = require('../server/server');
const {Todo} = require('../models/todo');

//dummy todos
const todos = [
    {
        text:'first test todo',

    },
    {
        text:'second test todo'
    }
];

beforeEach((done) => { //before each test case clear the database of todos and add the dummys
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
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