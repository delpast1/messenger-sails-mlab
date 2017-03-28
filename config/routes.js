
module.exports.routes = {

  '/': {
    view: 'homepage'
  },

    'post /signin' : 'AuthController.login',

    'post /conservation/createConservation': 'ConservationController.createConservation',
    'get /conservation/showConservation': 'ConservationController.listConservation',
    'post /conservation/getConservation': 'Conservation.getConservation',

    'post /user/signup': 'UserController.createUser',
    'get /user/showUsers': 'UserController.listUser',
    'get /user/conservations': 'UserController.getListOfConservations',
    'get /user/notifications': 'UserController.getNotifications',

    'post /user/sendMessage': 'MessageController.sendMessage'
};
