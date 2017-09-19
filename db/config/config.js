var env = process.env.NODE_ENV || 'development'; //the test env is set in package.json test script

if(env === 'development' || env === 'test') {
    var config = require('./config.json'); //require automatically returns .json files as js object
    var envConfig = config[env]; //when you want to access a properties using a variable need to use bracket notation

    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
    });
}

//to check the uri value from the cmd type: heroku config --app APP_NAME_HERE
// if(env === 'development') {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// }
// else if(env === 'test') {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// }