var env = process.env.NODE_ENV || 'development'; //the test env is set in package.json test script

if(env === 'development' || env === 'test') {
    var config = require('./config.json'); //require automatically returns .json files as js object
    var envConfig = config[env]; //when you want to access a properties using a variable need to use bracket notation

    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
    });
}