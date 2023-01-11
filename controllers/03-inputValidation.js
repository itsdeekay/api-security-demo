const router = require('express').Router();
const log4js = require('log4js');

const helper = require('./../utility/helper');

const logger = log4js.getLogger('Controller');

function cleanData(req, res, next) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    const name = req.body.name;
    const email = req.body.email;
    const contactNo = req.body.contactNo;

    req.body.name = name.replace(/[&<>"']/g, function (m) { return map[m]; });
    req.body.email = email.replace(/[&<>"']/g, function (m) { return map[m]; });
    req.body.contactNo = contactNo.replace(/[&<>"']/g, function (m) { return map[m]; });

    next();
}


function validateData(req, res, next) {
    try {
        const regex = new RegExp(/[&<>"']/g);

        const name = req.body.name;
        const email = req.body.email;
        const contactNo = req.body.contactNo;

        if (name && regex.test(name)) {
            throw { message: "Invalid Name, Name can only contain Alphabets with spaces" }
        }
        if (email && regex.test(email)) {
            throw { message: "Invalid Email, Email can only contain Alphabets with spaces" }
        }
        if (contactNo && regex.test(contactNo)) {
            throw { message: "Invalid Contact No, Contact No can only contain Numbers" }
        }
        next();
    } catch (err) {
        logger.error(err);
        res.status(400).json({ message: err.message });
    }
}

router.get('/data', function (req, res, next) {
    res.json(helper.readData());
});

router.post('/data', validateData, function (req, res, next) {
    let body = req.body;
    body._id = helper.getRandomID();
    res.json(helper.writeData(body));
});

module.exports = router;