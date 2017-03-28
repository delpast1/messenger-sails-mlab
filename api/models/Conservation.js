/**
 * Conservation.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  schema: true,
  attributes: {
    title: {
      type: 'string'
    },

    users: {
      type: 'array',
      required: true
    },

    toJSON: function() {
      var obj = this.toObject();
      return obj;
    }
  }
};

