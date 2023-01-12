const router = require('express').Router();
const helper = require('./../utility/helper');

router.get('/data', function (req, res, next) {
    res.json(helper.readData());
});

router.post('/data', function (req, res, next) {
    let body = req.body
    body._id = helper.getRandomID();
    res.json(helper.writeData(body));
});

module.exports = router;