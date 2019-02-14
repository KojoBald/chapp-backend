const express = require('express');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const UserController = express.Router();
const UserModel = require('../db').import('../models/users')

UserController.post('/', createNewUser)

UserController.put('/login', loginUser );

UserController.put('/:id', _withUserFromId, updateUser);
UserController.delete('/:id', _withUserFromId, deleteUser);
UserController.get('/:id', _withUserFromId, getUser)
UserController.get('/:id/channels', _withUserFromId, getUserChannels)


UserController.use('/message', require('./usermessagecontroller'))

function createNewUser(req, res) {
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
            feedback: 'new user created',
            token: _createSessionTokenForUser(user.id)
        })
    }).catch(error => {
        res.status(500).send(error.message)
    });
}

function updateUser(req, res) { //TODO: make this require session token
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
                feedback: 'user updated'
            })
    }).catch(error => {
        res.status(400).send(error.message)
    })
}

function deleteUser(req, res) { //TODO: requires session token
    UserModel.destroy({
        where: { id: req.params.id }
    }).then(() => {
        res.status(200).json({ feedback: 'user deleted' })
    }).catch(error => {
        res.status(500).json({ 
            error: error.message, 
            feedback: 'there was an issue deleting user'
        })
    })
}

function getUser(req, res) {
    res.status(200).json({
        username: req.user.username,
        first: req.user.first,
        last: req.user.last,
        email: req.user.email,
        image: req.user.image,
        channels: req.user.channels
    });
}

function loginUser(req, res) {
    UserModel.findOne({
        where: { email: req.body.email }
    }).then(user => {
        if(user) {
            bcrypt.compare(req.body.password, user.password_hash, (err, matches) => {
                if(matches) {
                    res.status(200).json({
                        user: user,
                        feedback: 'user logged in',
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
}

function getUserChannels(req, res) {
    res.status(200).json(req.user.channels);
}

function _createSessionTokenForUser(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: 60*60*24 });
}

function _withUserFromId(req, res, next) {
    UserModel.findOne({
        where: { id: req.params.id }
    }).then(user => {
        if(!user) return res.status(404).send(`user with id: ${req.params.id} does not exist`);
        
        req.user = user;
        next();
    }).catch(error => {
        res.status(500).json({ error: error.message });
    })
}



module.exports = UserController;
