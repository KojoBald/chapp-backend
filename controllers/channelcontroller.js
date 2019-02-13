const channel = require('express').Router()
// const Channel = require('../db').import('../models/channel')
// const validateSession = require('../middleware/validate-session')


/******* CHANNELS *******/

//create new channel
channel.post('/', (req, res) => {
})

//get info for specific channel
channel.get('/:id', (req, res) => {
})

//update a channel
channel.put('/:id', (req, res) => {
})

//delete channel
channel.delete('/:id', (req, res) => {
})

//get all users in a channel
channel.get('/:id/users', (req, res) => {
})

//invite user to channel
channel.put('/:id/invite', (req, res) => {
})




/***** USERS ******/
const message = require('express').Router()
channel.use('/message', message);
//send message to channel
message.post('/', (req, res) => {
})

//get all messages from a channel
message.get('/all/:id', (req, res) => {
})

//edit message in a channel
message.put('/:id', (req, res) => {
})

//delete message in a channel
message.delete('/:id', (req, res) => {
})

module.exports = channel;