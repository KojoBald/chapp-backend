const Op = require('sequelize').Op;
const db = require('../db');
const validateSession = require('../middleware/validateSession');

const ChannelMessageController = require('express').Router();
const ChannelModel = db.import('../models/Channel');
const ChannelMessageModel = db.import('../models/ChannelMessage');

ChannelMessageController.use(validateSession);

ChannelMessageController.get('/', getUpdatedMessages)
ChannelMessageController.post('/', sendChannelMessage);

ChannelMessageController.get('/all', getChannelMessages);

ChannelMessageController.put('/:id', _withMessageFromId, _messageBelongsToUser, updateChannelMessage);
ChannelMessageController.delete('/:id', _withMessageFromId, _messageBelongsToUser, deleteChannelMessage);

function sendChannelMessage(req, res) {
    ChannelMessageModel.create({
        userId: req.authorizedUser.id,
        channelId: req.channel.id,
        text: req.body.text
    }).then(message => {
        res.status(200).json({
            message,
            feedback: 'channel created'
        })
    }).catch(err => {
        console.error(err)
        res.status(500).json({
            error: err.message,
            feedback: 'There was an error sending your message'
        })
    })
}

function getUpdatedMessages(req, res) {
    ChannelMessageModel.findAll({
        where: {
            channelId: req.channel.id,
            updatedAt: { [Op.gte]: req.query.updatedAt }
        }
    }).then(messages => {
        res.status(200).json(messages)
    }).catch(err => {
        res.status(500).json({
            error: err.message,
            feedback: 'There was an issue getting updated messages'
        })
    })
}

function getChannelMessages(req, res) {
    if(req.authorizedUser.channels.includes(req.channel.id)) {
        ChannelMessageModel.findAll({
            where: { channelId: req.channel.id },
            order: [['createdAt', 'ASC']]
        }).then(messages => {
            res.status(200).json(messages)
        }).catch(err => {
            console.error(err)
            res.status(500).json({ 
                error: err.message,
                feedback: 'There was an error getting the messages'
            })
        })
    } else {
        res.status(403).json({ feedback: 'You have not been invited to that channel' })
    }
   
}

function updateChannelMessage(req, res) {
    ChannelMessageModel.update({
        text: req.body.text
    }, { 
        where: { id: req.message.id },
        fields: ['text']
    }).then(channel => {
        req.message.text = req.body.text;
        res.status(200).json({
            message: req.message,
            feedback: 'message updated'
        })
    }).catch(err => {
        console.error(err)
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
        console.error(err)
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
        console.error(err)
        res.status(500).json({ 
            error: err.message,
            feedback: 'there was an issue finding that message'
        })
    })
}

function _messageBelongsToUser(req, res, next) {
    if(req.message.userId !== req.authorizedUser.id) {
        res.status(403).json({ error: 'that message does not belong to you' })
    } else {
        next();
    }
}

module.exports = ChannelMessageController;