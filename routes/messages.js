var express = require('express');
var router = express.Router();

var Message = require('../models/message');

router.get('/', function (req, res, next) {
    Message.find()
        .exec(function(error, messages) {
            if (error) {
                return res.status(500).json({
                    title: 'An Error Occured',
                    error: error
                });
            }
            res.status(200).json({
                 message: 'Success',
                 messages: messages
            })   
        });
});

router.post('/', function (req, res, next) {
    var message = new Message({
        content: req.body.content
    });
    message.save(function(error, result) {
        if (error) {
            return res.status(500).json({
                title: 'An Error Occured',
                error: error
            });
        }
        res.status(201).json({
            message: 'Saved Message',
            obj: result
        });
    });
});

router.patch('/:id', function(req, res, next) {
    Message.findById(req.params.id, function(error, message) {
        if (error) {
            return res.status(500).json({
                title: 'An Error Occured',
                error: error
            });
        }
        if (!message) {
            return res.status(500).json({
                title: 'NO MESSAGE FOUND',
                error: {message: 'Message Not Found'}
            });
        }
        message.content = req.body.content;
        message.save(function (error, result) {
            if (error) {
                return res.status(500).json({
                    title: 'An Error Occured',
                    error: error
                });
            }
            res.status(201).json({
                message: 'Updated Message',
                obj: result
            });
        });
    });
});

router.delete('/:id', function (req, res, next) {
    Message.findById(req.params.id, function(error, message) {
        if (error) {
            return res.statusMessage(500).json({
                title: 'An Error Occured',
                error: error
            });
        }
        if (!message) {
            return res.statusMessage(500).json({
                title: 'NO MESSAGE FOUND',
                error: {message: 'Message Not Found'}
            });
        }
        message.remove(function (error, result) {
            if (error) {
                return res.statusMessage(500).json({
                    title: 'An Error Occured',
                    error: error
                });
            }
            res.status(201).json({
                message: 'Deleted Message',
                obj: result
            });
        });
    });
});

module.exports = router;
