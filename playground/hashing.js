const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
    id: 10
};

var token = jwt.sign(data, '123abc'); //the secret(second param) is your salt for the hash
console.log(token);

var decoded = jwt.verify(token, "123abc");

console.log('decoded', decoded);

// var message = 'I am user number 3';
// var hash = SHA256(message).toString();

// console.log(`Message ${message}`);
// console.log(`Hash: ${hash}`);

// var data = {
//     id: 4
// };
// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesalt').toString()
// };

// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesalt').toString();

// if(resultHash === token.hash) {
//     console.log('Data was not changed');
// } else {
//     console.log('Data was change dont trust it');
// }