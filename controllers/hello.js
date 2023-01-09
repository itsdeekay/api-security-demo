const express = require('express');
const { authenticate, authorized } = require('../utility/authHelper');
let router = express.Router();

router.get('/', function (req, res, next) {
    res.send('Hello Page');
});

router.get('/authenticated',authenticate, function (req, res, next) {
    res.send('Authenticated Hello Page');
});

router.get('/authorized',authenticate,authorized, function (req, res, next) {
    res.send('Authorized Hello Page');
});

module.exports = router