const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const helper = require('./../utility/helper');
const users = require('../data/users');

const privateKey = "the-super-strong-secrect";

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

router.post('/login', async function (req, res) {
    let body = req.body;
    try {
        if (!body.username || !body.password) {
            throw { message: 'username and password is mandatory' }
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
        res.status(error.status).json({ message: error.message });
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