const router = require('express').Router();
const helper = require('./../utility/helper');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const privateKey = "the-super-strong-secrect";
const users = require('../data/users');

router.post('/login', async function (req, res) {
    let body = req.body;
    try {
        if (body.username && body.password) {
            let user = users.getDBUser(body.username);
            if (!user) throw { status: 401, message: "userid or password is incorrect" };
            let result = await bcrypt.compare(body.password, user.password);
            if (result) {
                const token = jwt.sign({ id: user.id }, privateKey, { expiresIn: '1h' });
                delete user.password;
                return res.status(200).send({
                    token,
                    user: user
                });
            } else throw { status: 401, message: "userid or password is incorrect" };
        } else throw { message: 'username and password is mandatory' }
    } catch (error) {
        logger.info(error)
        res.status(error.status).json({ message: error.message });
    }
});

const authenticate = (req, res, next) => {
    let headers = req.headers;
    try {
        if (headers.authorization) {
            let decodedToken = jwt.verify(headers.authorization, privateKey);
            next();
        } else throw { message: "Un-authenticated" }
    } catch (error) {
        res.status(401).json(error)
    }
}

router.get('/', authenticate, function (req, res, next) {
    res.json(helper.readData());
});

router.post('/', authenticate, function (req, res, next) {
    let body = req.body
    body._id = helper.getRandomID();
    res.json(helper.writeData(body));
});

module.exports = router;