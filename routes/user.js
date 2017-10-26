var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var User = require('../models/user');

router.post('/', function (req, res, next) {
    var user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: bcrypt.hashSync(req.body.password, 10),
        email: req.body.email,
    });
    user.save(function (error, result) {
        if (error) {
            return res.status(500).json({
                title: 'An Error Occured',
                error: error
            });
        }
        res.status(201).json({
            message: 'User Created',
            obj: result
        });
    });
});

router.post('/signin', function (req, res, next) {
    User.findOne({
        email: req.body.email
    }, function(error, user) {
        if (error) {
            return res.status(500).json({
                title: 'An Error Occured',
                error: error
            });
        }
        if (!user) {
            return res.status(401).json({
                title: 'Login failed',
                error: {message: 'Invalid login credentials'}
            });
        }
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(401).json({
                title: 'Login failed',
                error: {message: 'Invalid login credentials'}
            });
        }
        var token = jwt.sign({user: user}, 'bigBoobz', {expiresIn: 7200});
        res.status(200).json({
            message: 'Login Successful',
            token: token,
            userId: user._id
        })
    });
})

module.exports = router;
