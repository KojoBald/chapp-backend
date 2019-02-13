const channel = require('express').Router()
// const Channel = require('../db').import('../models/channel')
// const validateSession = require('../middleware/validate-session')


/******* CHANNELS *******/

//create new channel
channel.post('/channel', validateSession, (req, res) => {
})

//get info for specific channel
channel.get('/channel/:id', (req, res) => {
})

//update a channel
channel.put('/channel/:id', (req, res) => {
})

//delete channel
channel.delete('/channel/:id', (req, res) => {
})

//get all users in a channel
channel.get('/channel/:id/users', (req, res) => {
})

//invite user to channel
channel.put('/channel/:id/invite', (req, res) => {
})




/***** USERS ******/
const message = require('express').Router()

//send message to channel
message.post('/channel/message', validateSession, (req, res) => {
})

//get all messages from a channel
channel.get('/channel/message/all/:id', (req, res) => {
})

//edit message in a channel
message.put('/channel/message/:id', (req, res) => {
})

//delete message in a channel
message.delete('/channel/message/:id', (req, res) => {
})
