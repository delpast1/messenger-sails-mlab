/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var bcrypt = require('bcrypt');
module.exports = {
  schema: true,
  attributes: {
    username: {
      type: 'string',
      required: 'true',
      unique: true
    },

    encryptedPassword: {
      type: 'string'
    },

    notices: {
      type: 'array'
    },

    toJSON: function() {
      var obj = this.toObject();
      //delete obj.encryptedPassword;
      return obj;
    }
  },

  //encrypt password before creating an user
 beforeCreate: (request, callback) => {
    let rq = request || {},
        cb = callback || {};
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return cb(err);
      bcrypt.hash(rq.password, salt, (err,hash) => {
        if (err) return cb(err);
        rq.encryptedPassword = hash;
        cb();
      });
    });
  },

  comparePassword: (password, user, callback) => {
    let cb = callback || {};
    bcrypt.compare(password, user.encryptedPassword, (err,match) => {
      if (err) cb(err);
      if (match) {
        cb(null,true);
      } else {
        cb(err);
      }
    });
  },

  notification: (users, from, idConservation, callback) => {
    for(var i=0; i<users.length; i++) {
      if (users[i] !== from){
        User.findOne({username: users[i]}).exec((err,user) => {
          if (err) { return callback(err);}

          var check = false;
          var notices = user.notices;

          for(var j=0; j<notices.length; j++){
            if (notices[j] === idConservation) {
              check = true;
            }
          }

          if(!check){
            notices.push(idConservation);
            User.update({username: user.username}, {notices: notices}).exec( (err, updatedUser) => {
              if (err) return callback(err);
            });
          } 
        });
      }
    }
    return callback(null);
  }
  
};

