var jwt = require('jsonwebtoken');
var db = require('../db');
var User = db.import('../models/users');

module.exports = function(req, res, next)
{
    var sessionToken = req.headers.authorization;
    if(!sessionToken)
    {
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    }else
    {
        jwt.verify(sessionToken), process.env.JWT_SECRET, (err, decoded) =>
        {
            if(decoded)
            {
                User.findOne({where:{ id: decoded.id}}).then(user => 
                {
                    req.user = user
                    next();
                },
                function()
                {
                    res.status(401).send({error: 'Not Authorized'})
                })
            }else
            {
                res.status(400).send({error: 'Not authorized'});
            }
        }
    }
}