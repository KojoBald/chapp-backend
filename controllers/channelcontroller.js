const channel = require('express').Router()
const Channel = require('../db').import('../models/channel')
const validateSession = require('../middleware/validate-session')


/******* CHANNELS *******/

//create new channel
channel.post('/channel', validateSession, (req, res) => {
    if(!req.error) {
        const channelFromRequest = {
            name: req.body.name,
            users: req.body.users,
            admin_id: req.body.admin_id,
        }

        Channel.create(channelFromRequest)
            .then(channel => res.status(200).json(channel))
            .catch(err => res.status(500).json({error: err}))
    }
    else {
        res.status(500).json(req.errors)
    }
})

//get info for specific channel
channel.get('/channel/:id', (req, res) => {
    Channel.findOne({ where: { name: req.params.name }})
    .then(channel => res.status(200).json(channel))
    .catch(err => res.status(500).json({ error: err}))
})

//update a channel
channel.put('/channel/:id', (req, res) => {
    if (!req.errors) {
        Channel.update(req.body.channel, { where: { id: req.params.id }})
          .then(channel => res.status(200).json(channel))
          .catch(err => res.status(500).json(req.errors))
      } else {
          res.status(500).json(req.errors)
        }
})

//delete channel
channel.delete('/channel/:id', (req, res) => {
    if(!req.errors) {
        Channel.destroy({ where: {id:  
            req.params.id }})
            .then(channel => res.status(200).json(channel))
            .catch(err => res.status(500).json({error: err}))
    }
    
    else {
        res.status(500).json(req.errors)
    }
})

//get all users in a channel
channel.get('/channel/:id/users', (req, res) => {
    Channel.findAll()
        .then(channel => res.status(200).json(channel))
        .catch(err => res.status(500).json({ error: err}))
})

//invite user to channel
channel.put('/channel/:id/invite', (req, res) => {
if (!req.errors) {
    Channel.update(req.body.channel, { where: { id: req.params.id }})
        .then(channel => res.status(200).json(channel))
        .catch(err => res.status(500).json(req.errors))
    } else {
        res.status(500).json(req.errors)
    }
})



/***** USERS ******/
const message = require('express').Router()


//send message to channel
message.post('/channel/message', validateSession, (req, res) => {
    if(!req.error) {
        const messageFromRequest = {
            username: req.body.username,
            channel: req.body.channel,
            message: req.body.message,
        }

        Channel.create(messageFromRequest)
            .then(channel => res.status(200).json(channel))
            .catch(err => res.status(500).json({error: err}))
    }
    else {
        res.status(500).json(req.errors)
    }
})

//get all messages from a channel
message.get('/channel/message/all/:id', (req, res) => {
    Channel.findAll()
        .then(channel => res.status(200).json(channel))
        .catch(err => res.status(500).json({ error: err}))
})

//edit message in a channel
message.put('/channel/message/:id', (req, res) => {
    if (!req.errors) {
        Channel.update(req.body.channel, { where: { id: req.params.id }})
          .then(channel => res.status(200).json(channel))
          .catch(err => res.status(500).json(req.errors))
      } else {
          res.status(500).json(req.errors)
        }
})

//delete message in a channel
message.delete('/channel/message/:id', (req, res) => {
    if(!req.errors) {
        Channel.destroy({ where: {id:  
            req.params.id }})
            .then(channel => res.status(200).json(channel))
            .catch(err => res.status(500).json({error: err}))
    }
    
    else {
        res.status(500).json(req.errors)
    }
})
