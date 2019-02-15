const express = require('express');
const Op = require('sequelize').Op;

const validateSession = require('../middleware/validateSession');
const db = require('../db');

const UserMessageController = express.Router();
const UserModel = db.import('../models/User')
const DirectMessageModel = db.import('../models/DirectMessage');

UserMessageController.use(validateSession);

UserMessageController.post('/', sendDirectMessage);

UserMessageController.put('/:id', _withMessageFromId, _messageBelongsToUser, updateDirectMessage);
UserMessageController.delete('/:id', _withMessageFromId, _messageBelongsToUser, deleteDirectMessage);

UserMessageController.get('/all/:userId', getAllDirectMessages);

function sendDirectMessage(req, res) {
    UserModel.findOne({
        where: { id: req.body.to }
    }).then(user => {
        if(user) {
            return DirectMessageModel.create({
                from: req.authorizedUser.id,
                to: req.body.to,
                message: req.body.message
            })
        } else {
            res.status(404).json({ error: 'the user you are messaging does not exist' })
        }
    }).then(message => {
        res.status(200).json({
            message,
            feedback: 'message sent'
        })
    }).catch(error => {
        res.status(500).json({ error: error.message })
    })
}

function updateDirectMessage(req, res) {
    DirectMessageModel.update({
        message: req.body.message
    }, {
        where: { id: req.message.id },
        fields: ['message']
    }).then(() => {
        req.message.message = req.body.message;
        res.status(200).json({
            message: req.message,
            feedback: 'message updated'
        })
    }).catch(error => {
        res.status(500).json({ error: error.message });
    })
}

function deleteDirectMessage(req, res) {
    DirectMessageModel.destroy({
        where: { id: req.message.id }
    }).then(() => {
        res.status(200).json({ feedback: 'message deleted' })
    }).catch(error => {
        res.status(500).json({
            error: error.message,
            feedback: 'there was an error deleting your message'
        })
    })
}

function getAllDirectMessages(req, res) {
    DirectMessageModel.findAll({
        where: { 
            [Op.and]: {
                from: {
                    [Op.or]: [req.authorizedUser.id, req.params.userId]
                },
                to: {
                    [Op.or]: [req.authorizedUser.id, req.params.userId]
                }
            }
        },
        order: [['createdAt', 'ASC']]
    }).then(messages => {
        res.status(200).json(messages);
    }).catch(error => {
        res.status(500).json({
            error: error.message,
            feedback: 'there was an error getting these messages'
        })
    })
}

function _withMessageFromId(req, res, next) {
    DirectMessageModel.findOne({
        where: { id: req.params.id }
    }).then(message => {
        if(!message) return res.status(404).json({ error: `direct message with id ${req.params.id} does not exist`})

        req.message = message;
        next();
    }).catch(error => {
        res.status(500).json({ error: error.message });
    })
}

function _messageBelongsToUser(req, res, next) {
    if(req.message.from !== req.authorizedUser.id) {
        res.status(403).json({ error: 'that message does not belong to you' })
    } else {
        next()
    }
}

module.exports = UserMessageController;