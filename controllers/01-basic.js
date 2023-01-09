const express = require('express');
let router = express.Router();
const helper = require('./../utility/helper');

router.get('/', function (req, res, next) {
    res.json(helper.readData());
});

router.post('/', function (req, res, next) {
    let body = req.body
    res.json(helper.writeData(body));
});

module.exports = router;