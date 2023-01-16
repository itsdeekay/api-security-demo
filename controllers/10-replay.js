const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const log4js = require('log4js');
const { TOTP, Secret } = require('otpauth');
const QRCode = require('qrcode');

const helper = require('./../utility/helper');
const users = require('../data/users');

const logger = log4js.getLogger('Controller');
const privateKey = "the-super-strong-secrect";

const auth = new TOTP({
    issuer: 'Appveen',
    digits: 6,
    algorithm: 'SHA256',
    label: 'jugnu@appveen.com',
    secret: Secret.fromUTF8(privateKey),
    period: 30
});

const uri = auth.toString();
QRCode.toFile('qrcode.jpg', uri, (err) => {
    console.log(err);
});

function authCheck(req, res, next) {
    let authorization = req.header('authorization');
    try {
        if (!authorization) {
            throw { message: "Unauthorised" }
        }
        jwt.verify(authorization, privateKey);
        next();
    } catch (error) {
        res.status(401).json(error)
    }
}


router.get('/token', function (req, res, next) {
    const token = auth.generate();
    res.json({ token });
});

router.post('/login', async function (req, res) {
    let body = req.body;
    try {
        if (!body.username || !body.password || !body.totp) {
            throw { message: 'username, password and totp is mandatory' }
        }
        logger.info(body);
        const st = auth.validate({ token: body.totp + '' });
        logger.info(st);
        if (st == null) {
            throw { message: 'Invalid Token' }
        }
        let user = users.getDBUser(body.username);
        if (!user) {
            throw { status: 401, message: "userid or password is incorrect" };
        }
        let result = await bcrypt.compare(body.password, user.password);
        if (!result) {
            throw { status: 401, message: "userid or password is incorrect" };
        }
        const token = jwt.sign({ id: user.id }, privateKey, { expiresIn: '1h' });
        delete user.password;
        res.status(200).send({
            token,
            user: user
        });
    } catch (error) {
        logger.info(error)
        res.status(error.status || 401).json({ message: error.message });
    }
});

router.get('/data', authCheck, function (req, res, next) {
    res.json(helper.readData());
});

router.post('/data', authCheck, function (req, res, next) {
    let body = req.body
    body._id = helper.getRandomID();
    res.json(helper.writeData(body));
});

module.exports = router;