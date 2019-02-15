var jwt = require('jsonwebtoken');
var db = require('../db');
var User = db.import('../models/User');

module.exports = (req, res, next) => {
    var sessionToken = req.headers.authorization;
    if(!sessionToken) {
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    } else {
        jwt.verify(sessionToken, process.env.JWT_SECRET, (err, decoded) => {
            if(decoded) {
                User.findOne({ where: { id: decoded.id } })
                    .then(user => {
                        req.authorizedUser = user
                        next();
                    })
                    .catch(err => {
                        res.status(403).json({ error: 'Not Authorized' })
                    })
            } else {
                res.status(403).json({ error: 'Not Authorized' });
            }
        })
    }
}