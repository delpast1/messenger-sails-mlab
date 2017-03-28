/**
 * MessageController
 *
 * @description :: Server-side logic for managing messages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    listMessage: (req, res) => {
        Message.find({}).exec( (err, messages) => {
            res.json({
                result: messages && !err ? messages : null,
                error: err ? err : null
            });
        });
    },

    sendMessage: (req, res) => {
        var workflow = new (require('events').EventEmitter)();
        
        workflow.on('validateParams', () => {
            var errors = [];
            if (!req.body.idConservation){
                errors.push('The Conservation ID required');
            }
            if (!req.body.content){
                errors.push('Message cannot be empty');
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
                workflow.emit('sendMessage');
            }
        });

        workflow.on('sendMessage', () => {
            var message = {
                idConservation: req.body.idConservation,
                from: req.decoded.username,
                content: req.body.content
            }

            Message.newMessage(message, (err) => {
                if (err) {
                    res.json({ 
                        error: err
                    });
                }

                workflow.on('notification', () => {
                    Conservation.findOne({id: message.idConservation}).exec((err, conser) => {
                        var users = conser.users;
                        User.notification(users, message.from, conser.id, (err) => {
                            if (err) {
                                res.json({ 
                                    error: err
                                });                            
                            }
                            workflow.emit('result');
                        });
                        
                    });
                });

                workflow.on('result', () => {
                    res.json({
                        message: 'sent'
                    });
                });
                workflow.emit('notification');
            });
        });

    workflow.emit('validateParams');
    }
};

