var jwt = require('jsonwebtoken');
const secretKey = require('../../config/session').session.secret;

module.exports.token = (payload) => {
    return jwt.sign(
        payload,
        secretKey,
        {
            expiresIn: 180*60
        }
    )
}

module.exports.verify = (token, callback) => {
    return jwt.verify(token, secretKey, 
        {}, //option 
        callback //Pass errors or decoded token to callback
    );
}