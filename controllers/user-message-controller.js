const express = require('express');
const Op = require('sequelize').Op;

const validateSession = require('../middleware/validateSession');
const db = require('../db');

const UserMessageController = express.Router();
const UserModel = db.import('../models/User')
const DirectMessageModel = db.import('../models/DirectMessage');

UserMessageController.use(validateSession);

UserMessageController.post('/', sendDirectMessage);
UserMessageController.get('/', getDirectMessagePartners)

UserMessageController.put('/:id', _withMessageFromId, _messageBelongsToUser, updateDirectMessage);
UserMessageController.delete('/:id', _withMessageFromId, _messageBelongsToUser, deleteDirectMessage);

UserMessageController.get('/all', getAllDirectMessages);

function sendDirectMessage(req, res) {
    UserModel.findOne({
        where: { id: req.user.id }
    }).then(user => {
        if(user) {
            return DirectMessageModel.create({
                from: req.authorizedUser.id,
                to: req.user.id,
                text: req.body.text
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
        console.error(error)
        res.status(500).json({ 
            error: error.message,
            feedback: 'there was an issue sending your message'
        })
    })
}

function getDirectMessagePartners(req, res) {
    let ids = [];
    DirectMessageModel.aggregate('from', 'DISTINCT', { 
        plain: false,
        where: { 
            from: { [Op.not]: req.authorizedUser.id }
        }
    }).then(distincts => {
        distincts.forEach(distinct => ids.push(distinct.DISTINCT));
        return DirectMessageModel.aggregate('to', 'DISTINCT', {
            plain: false,
            where: {
                to: { [Op.notIn]: ids }
            }
        })
    }).then(distincts => {
        distincts.forEach(distinct => ids.push(distinct.DISTINCT))
        return UserModel.findAll({
            where: {
                id: { [Op.in]: ids }
            },
            attributes: ['username', 'id']
        })
    }).then(users => {
        res.status(200).json(users);
    })
}

function updateDirectMessage(req, res) {
    DirectMessageModel.update({
        text: req.body.text
    }, {
        where: { id: req.message.id },
        fields: ['text']
    }).then(() => {
        req.message.text = req.body.text;
        res.status(200).json({
            message: req.message,
            feedback: 'message updated'
        })
    }).catch(error => {
        console.error(error)
        res.status(500).json({ 
            error: error.message, 
            feedback: 'there was an issue editing your message'
        });
    })
}

function deleteDirectMessage(req, res) {
    DirectMessageModel.destroy({
        where: { id: req.message.id }
    }).then(() => {
        res.status(200).json({ feedback: 'message deleted' })
    }).catch(error => {
        console.error(error)
        res.status(500).json({
            error: error.message,
            feedback: 'there was an issue deleting your message'
        })
    })
}

function getAllDirectMessages(req, res) {
    DirectMessageModel.findAll({
        where: { 
            [Op.and]: {
                from: {
                    [Op.or]: [req.authorizedUser.id, req.user.id]
                },
                to: {
                    [Op.or]: [req.authorizedUser.id, req.user.id]
                }
            }
        },
        order: [['createdAt', 'ASC']]
    }).then(messages => {
        res.status(200).json(messages);
    }).catch(error => {
        console.error(error)
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
        console.error(error);
        res.status(500).json({ 
            error: error.message,
            feedback: 'there was an issue finding that message'
        });
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