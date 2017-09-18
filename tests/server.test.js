const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

//local
const {app} = require('../server/server');
const {Todo} = require('../models/todo');
const {User} = require('../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);


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

describe('PATCH /todos/:id', () => {

    it('should update the todo', (done) => {
        var newTxt = 'this is the updated text';
        request(app)
            .patch(`/todos/${todos[0]._id}`)
            .send({text: newTxt, completed: true})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.text).toBe(newTxt);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end(done);
    });

    it('should clear completedAt when todo is not completed', (done) => {
        request(app)
            .patch(`/todos/${todos[1]._id}`)
            .send({completed: false})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end(done);
    });

    it('should respond with 404 because todo doenst exist', (done) => {
        request(app)
            .patch(`/todos/${new ObjectId().toHexString()}`)
            .expect(404)
            .expect((res) => {
                expect(res.body.error).toBe('TODO_DOSENT_EXIST');
            })
            .end(done);
    });

    it('should respond with 400 because invalid object id', (done) => {
        request(app)
            .patch('/todos/123')
            .expect(400)
            .expect((res) => {
                expect(res.body.error).toBe('INVALID_ID');
            })
            .end(done);
    });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return a 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body.error).toBe('UNAUTHORIZED');
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        var email = 'example@exmple.com';
        var password = '123mb!';

        request(app)
            .post('/users')
            .send({email,password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if(err) {
                    done(err);
                }

                User.findOne({email}).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return a validation error if invalid email', (done) => {
        var email = 'bademail@bcom';  
        var password = '123baf!';


        request(app)
            .post('/users')
            .send({email,password})
            .expect(400)
            .expect((res) => {
                expect(res.body.errorMessage).toBe('INVALID_USER_INFORMATION');
            })
            .end((err) => {
                if(err) {
                    done(err);
                }

                User.findOne({email}).then((user) => {
                    expect(user).toNotExist();
                    done();
                });
            });
    });

    it('should return a validation error if invalid password', (done) => {
        var email = 'bademail@balls.com';  
        var password = '12!';

        request(app)
            .post('/users')
            .send({email,password})
            .expect(400)
            .expect((res) => {
                expect(res.body.errorMessage).toBe('INVALID_USER_INFORMATION');
            })
            .end((err) => {
                if(err) {
                    done(err);
                }

                User.findOne({email}).then((user) => {
                    expect(user).toNotExist();
                    done();
                });
            });
    });

    it('should not create user if email is already in user', (done) => {
        request(app)
            .post('/users')
            .send({email:users[0].email,password:'test2344'})
            .expect(400)
            .expect((res) => {
                expect(res.body.errorMessage).toBe('INVALID_USER_INFORMATION');
            })
            .end(done);
    });
});

describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({email:users[1].email, password: users[1].password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[0]).toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should reject because user doesnt exist', (done) => {
        request(app)
            .post('/users/login')
            .send({email:'userdoesntexist@example.com',password:'test123'})
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toNotExist();
                expect(res.body.error).toBe('USER_DOESNT_EXIST');
            })
            .end(done);
    });

    it('should reject of invalid password', (done) => {
        request(app)
            .post('/users/login')
            .send({email:users[1].email,password:'test123'})
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toNotExist();
                expect(res.body.error).toBe('INCORRECT_PASSWORD');
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('DELETE /users/me/token', () => {
    
        it('should remove auth token on logout', (done) => {
            request(app)
                .delete('/users/me/token')
                .set('x-auth',users[0].tokens[0].token)
                .expect(200)
                .end((err, res) => {
                    if(err) {
                        return done(err);
                    }
    
                    User.findById(users[0]._id).then((user) => {
                        expect(user.tokens.length).toBe(0);
                        done();
                    }).catch((e) => done(e));
                });
    
        });

        it('should receive a 401 because unauthorized', (done) =>{
            request(app)
                .delete('/users/me/token')
                .expect(401)
                .expect((res) => {
                    expect(res.body.error).toBe('UNAUTHORIZED');
                })
                .end(done);
        });
    });