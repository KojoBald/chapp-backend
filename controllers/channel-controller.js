const ChannelController = require('express').Router()
const db = require('../db')
const sequelize = require('sequelize')
const Op = sequelize.Op;
const ChannelModel = db.import('../models/Channel')
const UserModel = db.import('../models/User')
const validateSession = require('../middleware/validateSession')

ChannelController.post('/', validateSession, createChannel)

ChannelController.get('/:id', _withChannelFromId, getChannel)
ChannelController.put('/:id', validateSession, _withChannelFromId, _isChannelAdmin, updateChannel)
ChannelController.delete('/:id', validateSession, _withChannelFromId, _isChannelAdmin, deleteChannel)

ChannelController.get('/:id/users', _withChannelFromId, getChannelUsers)

ChannelController.put('/:id/invite', validateSession, _withChannelFromId, _isChannelAdmin, inviteUsersToChannel)

ChannelController.use('/:id/message', _withChannelFromId, require('./channel-message-controller'));

function createChannel(req, res) {
    const channelFromRequest = {
        name: req.body.name,
        users: [ req.authorizedUser.id ],
        admin: req.authorizedUser.id,
    }

    ChannelModel.create(channelFromRequest)
        .then(channel => {
            UserModel.update({
                channels: sequelize.fn('array_append', sequelize.col('channels'), channel.id)
            }, {
                where: { id: channel.admin }
            })
            return _addUsersToChannel(channel, req.body.users)
        })
        .then(channel => {
            res.status(200).json({
                channel,
                feedback: 'channel created'
            })
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: err,
                feedback: 'there was an issue creating channel'
            })
        })
    
}

function getChannel(req, res) {
    res.status(200).json(req.channel);
}

function updateChannel(req, res) {
    req.channel.name = req.body.name;
    ChannelModel.update({
        name: req.body.name
    }, { 
        where: { id: req.params.id },
        fields: ['name']
    }).then(channel => {
        return _addUsersToChannel(req.channel, req.body.users)    
    }).then(channel => {
        res.status(200).json({
            channel: req.channel,
            feedback: 'channel updated'
        })
    }).catch(err => {
        console.error(err)
        res.status(500).json({ 
            error: err.message, 
            feedback: 'there was an issue updating channel'
        })
    })
}

function deleteChannel(req, res) {
    ChannelModel.destroy({ 
        where: { id: req.channel.id }
    }).then(() => { 
        res.status(200).json({ feedback: 'channel deleted' })
    }).catch(err => {
        console.error(err)
        res.status(500).json({ 
            error: err.message,
            feedback: 'there was an issue deleting channel'
        }) 
    })
}

function getChannelUsers(req, res) {
    res.status(200).json(req.channel.users);
}

function inviteUsersToChannel(req, res) { 
    // req.body.users = req.body.users.filter(user => !req.channel.users.includes(user))
    // req.channel.users = req.channel.users.concat(req.body.users)
    // ChannelModel.update({
    //     users: req.channel.users
    // }, { 
    //     where: { id: req.params.id },
    //     fields: ['users']
    // }).then(channel => {
    //     UserModel.update(
    //         { channels: sequelize.fn('array_append', sequelize.col('channels'), req.channel.id) },
    //         { where: { id: req.body.users } }
    //     )
    //     res.status(200).json({
    //         channel: req.channel,
    //         feedback: 'channel updated'
    //     })
    // }).catch(err => {
    //     console.error(err)
    //     res.status(500).json({ 
    //         error: err.message,
    //         feedback: 'there was an issue inviting the user to channel'
    //     })
    // })
    _addUsersToChannel(req.channel, req.body.users)
        .then(channel => {
            res.status(200).json({
                channel,
                feedback: 'channel updated'
            })
        })
        .catch(error => {
            res.status(500).json({
                error: error.message,
                feedback: 'there was an issue inviting users to the channel'
            })
        })
}

function _addUsersToChannel(channel, users) {
    users = users.filter(user => !channel.users.includes(user))
    channel.users = channel.users.concat(users)

    return new Promise((resolve, reject) => {
        ChannelModel.update({
            users: channel.users
        }, { 
            where: { id: channel.id },
            fields: ['users']
        }).then(channel => {
            return UserModel.update(
                { channels: sequelize.fn('array_append', sequelize.col('channels'), channel.id) },
                { where: { id: users } }
            )
        }).then(updatedUser => {
            resolve(channel, updatedUser)
        }).catch(error => {
            reject(error)
        })
    })
}

function _withChannelFromId(req, res, next) {
    ChannelModel.findOne({
        where: { id: req.params.id }
    }).then(channel => {
        if(!channel) return res.status(404).json({ error: `channel with id ${req.params.id} does not exist`})

        req.channel = channel;
        next();
    }).catch(err => {
        console.error(err);
        res.status(500).json({ 
            error: err.message,
            feedback: 'there was an issue finding that channel'
        })
    })
}

function _isChannelAdmin(req, res, next) {
    if(req.authorizedUser.id === req.channel.admin) {
        next();
    } else {
        res.status(403).json({ error: 'You are not the admin of that channel' })
    }
}
module.exports = ChannelController;