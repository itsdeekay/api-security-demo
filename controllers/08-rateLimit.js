const express = require('express');
const rateLimit = require('express-rate-limit')
let router = express.Router();
const helper = require('./../utility/helper');


const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minutes
	max: 5, // Limit each IP to 100 requests per `window` (here, per 1 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

router.get('/', limiter, function (req, res, next) {
    res.json(helper.readData());
});

router.post('/',limiter, function (req, res, next) {
    let body = req.body
    res.json(helper.writeData(body));
});

module.exports = router;