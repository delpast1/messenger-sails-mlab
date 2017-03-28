/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
var jwt = require('jsonwebtoken');
const secretKey = require('../../config/session').session.secret;
module.exports = function(req, res, next) {
    var token = req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                res.json({
                    result: null,
                    error: 'Invalid token'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.json({
            result: null,
            error: 'Authorization required'
        });
    }
};
