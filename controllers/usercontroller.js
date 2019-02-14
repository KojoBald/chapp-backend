const express = require('express');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const UserController = express.Router();
const UserModel = require('../db').import('../models/users')
/*  /user  */
UserController.post('/', (req, res) => {
    UserModel.create({
        username: req.body.username,
        password_hash: bcrypt.hashSync(req.body.password, 10),
        email: req.body.email,
        image: req.body.image,
        first: req.body.first,
        last: req.body.last
    }).then(user => {
        res.status(200).json({
            user,
            message: 'new user created',
            token: _createSessionTokenForUser(user.id)
        })
    }).catch(error => {
        res.status(500).send(error.message)
    });
})

UserController.use('/:id', (req, res, next) => {
    UserModel.findOne({
        where: { id: req.params.id }
    }).then(user => {
        if(!user) { 
            return res.status(404).send(`user with id: ${req.params.id} does not exist`);
        }
        req.user = user;
        next();
    }).catch(error => {
        res.status(500).send(error.message);
    })
})
UserController.put('/:id', (req, res) => { //TODO: make this require session token
    let updatedUser = {
        username: req.body.username || req.user.username,
        email: req.body.email || req.user.email,
        image: req.body.image || req.user.image,
        first: req.body.first || req.user.first,
        last: req.body.last || req.user.last
    }
    UserModel.update(updatedUser, { 
        where: { id: req.user.id },
    }).then(() => {
            res.status(200).json({
                user: updatedUser,
                message: 'user updated'
            })
    }).catch(error => {
        res.status(400).send(error.message)
    })
});
UserController.delete('/:id', (req, res) => { //TODO: requires session token
    UserModel.destroy({
        where: { id: req.params.id }
    }).then(() => {
        res.status(200).json({
            message: 'user deleted'
        })
    }).catch((error) => {
        res.status(500).send('there was an error deleting user')
    })
});

/*  /user/:id  */
UserController.get('/:id', (req, res) => {
    res.status(200).json({
        username: req.user.username,
        first: req.user.first,
        last: req.user.last,
        email: req.user.email,
        image: req.user.image,
        channels: req.user.channels
    });
})

/*  /user/login  */
UserController.put('/login', (req, res) => {
    UserModel.findOne({
        where: { email: req.body.email }
    }).then(user => {
        if(user) {
            bcrypt.compare(req.body.password, user.password_hash, (err, matches) => {
                if(matches) {
                    res.status(200).json({
                        user: user,
                        message: 'user logged in',
                        token: _createSessionTokenForUser(user.id)
                    })
                } else {
                    res.status(400).send('credentials invalid')
                }
            })
        } else {
            res.status(404).send('no user with that email');
        }
    }).catch(error => {
        res.status(500).send(error.message);
    })
}) 

/*  /user/channels/all/:id  */
UserController.get('/:id/channels', (req, res) => {
    res.status(200).json(req.user.channels);
})

/*  USER MESSAGES CONTROLLER  */
const UserMessageController = express.Router();
UserController.use('/message', UserMessageController)

/*  /user/message/  */
UserMessageController.post('/', (req, res) => {
    res.send('you sent a direct message')
})

/*  /user/message/:id  */
UserMessageController.put('/:id', (req, res) => {
    res.send('you updated a direct message')
})
UserMessageController.delete('/:id', (req, res) => {
    res.send('you deleted a direct message')
})

/*  /user/message/all/:id  */
UserMessageController.get('/all/:id', (req, res) => {
    res.send('you got all messages between you and another user')
})

function _createSessionTokenForUser(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: 60*60*24 });
}

module.exports = UserController;
