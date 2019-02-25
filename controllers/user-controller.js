const express = require('express');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const Op = require('sequelize').Op;

const validateSession = require('../middleware/validateSession');

const UserController = express.Router();
const UserModel = require('../db').import('../models/User')

UserController.post('/', createNewUser)
UserController.get('/', searchForUser)

UserController.put('/login', loginUser );

UserController.use('/:id', _withUserFromId);
UserController.route('/:id')
    .put(validateSession, _isSelf, updateUser)
    .delete(validateSession, _isSelf, deleteUser)
    .get(getUser)

UserController.get('/:id/channels', getUserChannels)

UserController.use('/:id/message', require('./user-message-controller'))

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
        console.error(error)
        res.status(500).json({
            error: error.message, 
            feedback: error.errors[0].message || 'there was an issue creating user'
        })
    });
}

function searchForUser(req, res) {
    if(!req.query.q || req.query.q === '') return res.json([]);
    UserModel.findAll({
        where: {
            [Op.or]: {
                username: { [Op.iLike]: `%${req.query.q}%` },
                first: { [Op.iLike]: `%${req.query.q}%` },
                last: { [Op.iLike]: `%${req.query.q}%` }
            }
        },
        attributes: ['id', 'username', 'first', 'last']
    }).then(users => {
        res.status(200).json(users);
    })
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
        console.error(error)
        res.status(400).json({
            error: error.message,
            feedback: 'there was an issue creating user'
        })
    })
}

function deleteUser(req, res) { //TODO: requires session token
    UserModel.destroy({
        where: { id: req.params.id }
    }).then(() => {
        res.status(200).json({ feedback: 'user deleted' })
    }).catch(error => {
        console.error(error)
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
        console.error(error)
        res.status(500).json({
            error: error.message,
            feedback: 'there was an issue logging in'
        });
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
        console.error(error)
        res.status(500).json({ 
            error: error.message,
            feedback: 'there was an issue getting user channels'
        });
    })
}

function _isSelf(req, res, next) {
    if(req.user.id === req.authorizedUser.id) {
        next();
    } else {
        res.send(403).json({ error: 'you cannot change a user that is not you' });
    }
}

module.exports = UserController;
