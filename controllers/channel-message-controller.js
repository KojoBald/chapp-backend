const db = require('../db');
const validateSession = require('../middleware/validateSession');

const ChannelMessageController = require('express').Router();
const ChannelModel = db.import('../models/Channel');
const ChannelMessageModel = db.import('../models/ChannelMessage');

ChannelMessageController.use(validateSession);

ChannelMessageController.post('/', sendChannelMessage);

ChannelMessageController.get('/all/:channelId', getChannelMessages);

ChannelMessageController.put('/:id', _withMessageFromId, _messageBelongsToUser, updateChannelMessage);
ChannelMessageController.delete('/:id', _withMessageFromId, _messageBelongsToUser, deleteChannelMessage);
//TODO: make all the message routes include channel id and use _withChannelFromId middleware

function sendChannelMessage(req, res) {
    ChannelMessageModel.create({
        user: req.authorizedUser.id,
        channel: req.body.channel,
        message: req.body.message
    }).then(message => {
        res.status(200).json({
            message,
            feedback: 'channel created'
        })
    }).catch(err => {
        res.status(500).json({
            error: err,
            feedback: 'There was an error creating the channel'
        })
    })
}

function getChannelMessages(req, res) {
    // if(req.authorizedUser.channels.includes(req.params.channelId)) {
        ChannelMessageModel.findAll({
            where: { channel: req.params.channelId },
            order: [['createdAt', 'ASC']]
        }).then(messages => {
            res.status(200).json(messages)
        }).catch(err => {
            res.status(500).json({ 
                error: err.message,
                feedback: 'There was an error getting the messages'
            })
        })
    // } else {
    //     res.status(403).json({ feedback: 'You have not been invited to that channel' })
    // }
   
}

function updateChannelMessage(req, res) {
    ChannelMessageModel.update({
        message: req.body.message
    }, { 
        where: { id: req.message.id },
        fields: ['message']
    }).then(channel => {
        req.message.message = req.body.message;
        res.status(200).json({
            message: req.message,
            feedback: 'message updated'
        })
    }).catch(err => {
        res.status(500).json({
            error: err.message,
            feedback: 'there was an error updating your message'
        })
    })
}

function deleteChannelMessage(req, res) {
    ChannelMessageModel.destroy({ 
        where: { id: req.message.id }
    }).then(() => {
        res.status(200).json({ feedback: 'message deleted' })
    }).catch(err => {
        res.status(500).json({
            error: err.message,
            feedback: 'There was an error deleting your message'
        })
    })
}

function _withMessageFromId(req, res, next) {
    ChannelMessageModel.findOne({
        where: { id: req.params.id }
    }).then(message => {
        if(!message) return res.status(404).json({ error: `channel message with id ${req.params.id} does not exist`})

        req.message = message;
        next();
    }).catch(err => {
        res.status(500).json({ error: err.message })
    })
}

function _messageBelongsToUser(req, res, next) {
    if(req.message.user !== req.authorizedUser.id) {
        res.status(403).json({ error: 'that message does not belong to you' })
    } else {
        next();
    }
}

module.exports = ChannelMessageController;