/**
 * ConservationController
 *
 * @description :: Server-side logic for managing conservations
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
    createConservation: (req, res) => {
        var request = req.body;
        var workflow = new (require('events').EventEmitter)();

        workflow.on('validateParams', () => {
            var errors = [];
            if (!request.users){
                errors.push('The receiver required');
            }
            if (!request.content){
                errors.push('Message required');
            }
            workflow.emit('finishValidate', errors);
        });

        workflow.on('finishValidate', (errors)=>{
            if (errors.length){
                res.json({ 
                    result: null,
                    error: errors
                });
            } else {
                workflow.emit('createConservation');
            }
        });

        workflow.on('createConservation', ( ) => {
            var users = request.users;
            users.unshift(req.decoded.username);
            Conservation.create({title: request.title, users: users}).exec((err, conser) => {
                if (err) {
                    return res.json(err.status, {error: err});
                }    
                
                var message = {
                    idConservation: conser.id,
                    from: req.decoded.username,
                    content: request.content
                }

                Message.newMessage(message, (err) => {
                    if (err) {
                        res.json({ 
                            error: err
                        });
                    }

                    workflow.on('notification', () => {
                        User.notification(request.users, message.from, conser.id, (err) => {
                            if (err) {
                                res.json({ 
                                    error: err
                                });                            
                            }
                            workflow.emit('result');
                        });
                    });

                    workflow.on('result', () => {
                        res.json({
                            Conservation: conser, 
                            error: null
                        });
                    });
                    workflow.emit('notification');
                });
            });
        });

        workflow.emit('validateParams');
    },

    listConservation: (req, res) => {
        Conservation.find({}).exec( (err, consers) => {
            res.json({
                result: consers && !err ? consers : null,
                error: err ? err : null
            });
        });
    },

    deleteConservation: (req, res) => {
        //deleted là một array lưu các record đã bị xóa
        Conservation.destroy({id: req.body.idConservation}).exec( (err, deleted) =>{
            if (err) {
                return res.json(err.status, {error: err});
            } 
            if (deleted.length !==0) {
                res.json({message: 'delete successfully'});
            } else {
                res.json({message: 'failed'});
            }
        });
    },

    getConservation: (req, res) => {
        Conservation.findOne({id: req.body.idConservation}).exec((err, conser) => {
            if (err) {
                return res.json(err.status, {error: err});
            }

            var users = conser.users;
            var check = false;

            for (var i=0;i<users.length;i++){
                if (req.decoded.username === users[i]){
                    check = true;
                    break;
                }
            }

            if (!check) {
                return res.json({message: "You are not in this conservation."})
            } else {
                User.findOne({username: req.decoded.username}).exec((err, user) => {
                    if (err) return res.json(err.status, {error: err});
                    if (user) {
                        var notices = user.notices;
                        for(var i=0; i<notices.length; i++) {
                            if (notices[i] === req.body.idConservation) {
                                notices.splice(i,1);
                                User.update({username: user.username}, {notices: notices}).exec( (err, updatedUser) => {
                                    if (err) return callback(err);
                                });
                                break;
                            }
                        }
                    }
                });

                Message.find({idConservation: req.body.idConservation}).exec((err, messages) => {
                    if (err) return res.json(err.status, {error: err});
                    if (messages) {
                        var result = [];
                        for(var i=0; i<messages.length; i++){
                            delete messages[i].createdAt;
                            delete messages[i].updatedAt;
                            result.push(messages[i]);

                            if (i+1 === messages.length) {
                                return res.json({
                                    idConservation: req.body.idConservation,
                                    messages: result
                                });
                            }
                        }
                    }
                });
            }
        });
    }
}

