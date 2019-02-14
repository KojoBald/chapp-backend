const ChannelController = require('express').Router()
const ChannelModel = require('../db').import('../models/channel')
const validateSession = require('../middleware/validateSession')

ChannelController.post('/', validateSession, createChannel)

ChannelController.get('/:id', _withChannelFromId, getChannel)
ChannelController.put('/:id', validateSession, _withChannelFromId, _isChannelAdmin, updateChannel)
ChannelController.delete('/:id', validateSession, _withChannelFromId, _isChannelAdmin, deleteChannel)

ChannelController.get('/:id/users', _withChannelFromId, getChannelUsers)

ChannelController.put('/:id/invite', validateSession, _withChannelFromId, _isChannelAdmin, inviteUserToChannel)

ChannelController.use('/message', require('./channelmessagecontroller'));

function createChannel(req, res) {
    const channelFromRequest = {
        name: req.body.name,
        users: [ req.authorizedUser.id ],
        admin_id: req.authorizedUser.id,
    }

    ChannelModel.create(channelFromRequest)
        .then(channel => res.status(200).json(channel))
        .catch(err => res.status(500).json({error: err}))
    
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
        res.status(200).json({
            channel: req.channel,
            feedback: 'channel updated'
        })
    }).catch(err => {
        res.status(500).json({ error: err.message })
    })
}

function deleteChannel(req, res) {
    ChannelModel.destroy({ 
        where: { id: req.channel.id }
    }).then(() => { 
        res.status(200).json({ feedback: 'channel deleted' })
    }).catch(err => {
        res.status(500).json({ error: err.message }) 
    })
}

function getChannelUsers(req, res) {
    res.status(200).json(req.channel.users);
}

function inviteUserToChannel(req, res) { //TODO: add channel to user's channels array
    req.channel.users.push(req.body.user)
    ChannelModel.update({
        users: req.channel.users
    }, { 
        where: { id: req.params.id },
        fields: ['users']
    }).then(channel => {
        res.status(200).json({
            channel: req.channel,
            feedback: 'channel updated'
        })
    }).catch(err => {
        res.status(500).json({ error: err.message})
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
        res.status(500).json({ error: err.message })
    })
}

function _isChannelAdmin(req, res, next) {
    if(req.authorizedUser.id === req.channel.admin_id) {
        next();
    } else {
        res.status(403).json({ error: 'You are not the admin of that channel' })
    }
}
module.exports = ChannelController;