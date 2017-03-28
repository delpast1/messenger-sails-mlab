
module.exports = {
    login: (req, res) => {
        if (!req.body.username || !req.body.password){
            return res.json(401, {error: 'id and password required'})
        }

        User.findOne({username: req.body.username}, (err, user) => {
            if (err) {
                return res.json(401, {error: 'username does not exist'});
            }

            User.comparePassword(req.body.password, user, (err, valid) => {
                if (err) {
                    return res.json(403, {error: 'forbiden'});
                }
                if (!valid) {
                    return res.json(401, {error: 'invalid password'});
                } else {
                    res.json({
                        message: 'Log in succesfully',
                        token: jwToken.token({username: user.username})
                    });
                }
            })
        });
    }
}