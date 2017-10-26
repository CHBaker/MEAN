var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../models/user');

var Message = require('../models/message');

router.get('/', function (req, res, next) {
    Message.find()
        .populate('user', 'firstName')
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

router.use('/', function (req, res, next) {
    jwt.verify(req.query.token, 'bigBoobz', function(error, decoded) {
        if (error) {
            return res.status(401).json({
                title: 'Not Authenticated',
                error: error
            });
        }
        next();
    });
});

router.post('/', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);
    User.findById(decoded.user._id, function(error, user) {
        if (error) {
            return res.status(500).json({
                title: 'An error occurred',
                error: error
            });
        }
        var message = new Message({
            content: req.body.content,
            user: user
        });
        message.save(function(error, result) {
            if (error) {
                return res.status(500).json({
                    title: 'An Error Occured',
                    error: error
                });
            }
            user.messages.push(result);
            user.save();
            res.status(201).json({
                message: 'Saved Message',
                obj: result
            });
        });
    });
});

router.patch('/:id', function(req, res, next) {
    var decoded = jwt.decode(req.query.token);
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
        if (message.user != decoded.user._id) {
            return res.status(401).json({
                title: 'Not Authenticated',
                error: {message: 'User is not owner'}
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
    var decoded = jwt.decode(req.query.token);
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
        if (message.user != decoded.user._id) {
            return res.status(401).json({
                title: 'Not Authenticated',
                error: {message: 'User is not owner'}
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
