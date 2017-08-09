var env = process.env.NODE_ENV || 'development'; //the test env is set in package.json test script

//to check the uri value from the cmd type: heroku config --app APP_NAME_HERE
if(env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp'
}
else if(env === 'test') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest'
}