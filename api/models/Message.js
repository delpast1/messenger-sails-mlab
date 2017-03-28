/**
 * Message.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  schema: true,
  attributes: {

    idConservation: {
      type: 'string',
      required: true
    },

    from: {
      type: 'string',
      required: true
    },

    content: {
      type: 'string',
      required: true
    },

    time: {
      type: 'string',
      required: true
    },
    
    toJSON: function() {
      var obj = this.toObject();
      return obj;
    }
  },

  newMessage: (request, callback) => {
    var time = new Date().toLocaleString();
    Message.create({idConservation: request.idConservation, from: request.from, content: request.content, time: time }).exec((err, message) => {
      if (err) {
        console.log(err);
        return callback(err);
      } 
      return callback(null);
    });
  }
};

