const router = require('express').Router();
const helper = require('./../utility/helper');

const validKeys = {
    "FHDKJSDHKJAIEEUOIR9872394243KJHWEQKJ":2,
    "FHDKDHJSKDKDHFUOIR9872394243KJHWEQKJ":10,
}

const authenticate = (req, res, next) => {
    if(validKeys[req.headers.API_KEY]) {
        validKeys[req.headers.API_KEY] = validKeys[req.headers.API_KEY] - 1;
        next();
    }
    else res.status(401).json({ message: "Un-authenticated" });
}

router.get('/',authenticate, function (req, res, next) {
    res.json(helper.readData());
});

router.post('/',authenticate, function (req, res, next) {
    let body = req.body;
    body._id = helper.getRandomID();
    res.json(helper.writeData(body));
});

module.exports = router;