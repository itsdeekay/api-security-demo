const router = require('express').Router();
const log4js = require('log4js');

const helper = require('./../utility/helper');

const logger = log4js.getLogger('Controller');

router.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:8000");
    // res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});


router.get('/data', limiter, function (req, res, next) {
    res.json(helper.readData());
});

router.post('/data', limiter, function (req, res, next) {
    let body = req.body;
    body._id = helper.getRandomID();
    res.json(helper.writeData(body));
});

module.exports = router;