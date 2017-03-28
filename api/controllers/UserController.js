/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    //create new user
	createUser: (req, res) => {
        if (req.body.password !== req.body.confirmPassword){
            return res.json(401, {error: 'Password doesn\'t match'});
        }
        var request= req.body;
        request.notices = []
        User.create(request).exec((err, user) => {
            if (err) {
                return res.json(err.status, {error: err});
            }
            // If user created successfuly we return user and token as response
            if (user) {
                res.json(200, {
                    message: 'created',
                    token: jwToken.token({username: user.username})
                });
            }
        });
    },

    listUser: (req, res) => {
        User.find({}).exec( (err, users) => {
            res.json({
                result: users && !err ? users : null,
                error: err ? err : null
            });
        });
    },

    deleteUser: (req, res) => {
        User.destroy({username: req.body.username}).exec( (err, deleted) =>{
            if (err) {
                return res.json(err.status, {error: err});
            } 
            if (deleted.length !== 0){
                res.json({message: 'delete successfully'});
            } else {
                res.json('failed');
            }
        });
    },

    getListOfConservations: (req, res) => {
        Conservation.find({}).exec((err, consers) => {
            if (err) return res.json(err.status, {error: err});
            var result = [];
            for(var i=0; i<consers.length; i++){
                let users = consers[i].users;
                for(var j=0; j<users.length; j++){
                    if (req.decoded.username === users[j]){
                        result.push(consers[i].id);
                        break;
                    }
                }
                if (i+1 === consers.length){
                    return res.json({
                        message: 'your conservation',
                        conservations: result
                    });
                }
            }
        });
    },

    getNotifications: (req, res) => {
        User.findOne({username: req.decoded.username}).exec((err, user) => {
            if (err) return res.json(err.status, {error: err});
            if (user){
                return res.json({
                    message: 'Notification',
                    unread_conservation: user.notices
                });
            }
        }); 
    }
};

