var {User} = require('../../models/user');

var authenticate = (req,res,next) => {
    var token = req.header('x-auth');
    
    User.findByToken(token).then((user) => {
        if(!user) {  //was a valid token but for some reason couldnt find a document in database
            return Promise.reject();
        }
        req.user = user;
        req.token = token;
        next();
    }).catch((e) => {
        res.status(401).send({error:"UNAUTHORIZED"});
    });
};

module.exports = {authenticate};