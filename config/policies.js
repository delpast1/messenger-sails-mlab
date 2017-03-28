


module.exports.policies = {
    '*': ['sessionAuth'],
    'UserController': {
      'createUser': true // We dont need authorization here, allowing public access
    },
    'AuthController': {
      '*': true
    }
};
