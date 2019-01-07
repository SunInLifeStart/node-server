const express = require('express');
const request = require('request');
const config = require('../config');
const router = express.Router();

/* GET users listing. */
router.post('/login', function (req, res, next) {
    req.session.user = 'yangjing';
    request.post({
        url: config.url.host + '/api/auth/jwt/token',
        body: {username: 'yangjing', password: '123456'},
        json: true
    }, (err, res, body) => {
        var options = {
            url: config.url.host + "/api/admin/user/userInfo",
        };
        request(options, function (err, res, body) {
            console.log(body,"============3333=============", err);
        })
    })
});

module.exports = router;
