const express = require('express');
let router = express.Router();
const helper = require('./../utility/helper');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const privateKey = "the-super-strong-secrect";
const users = require('../data/users');

global.tokens = {};

const getUser = (token) => {
    return global.tokens[token];
}

const putUser = (token, user) => {
    global.tokens[token] = user;
}

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
                putUser(token, user);
                return res.status(200).send({
                    token,
                    user: user
                });
            } else throw { status: 401, message: "userid or password is incorrect" };
        } else throw { message: 'username and password is mandatory' }
    } catch (error) {
        console.log(error)
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

const authorized = (req, res, next) => {
    let headers = req.headers;
    try {
        let user = getUser(headers.authorization);
        if (!user) throw {code:401, message: "Un-authenticated" };
        if (user.authorized) next();
        else throw {code:403, message: "Un-authorized" };
    } catch (error) {
        res.status(error.code).json(error.message)
    }
}

router.get('/', authenticate, authorized, function (req, res, next) {
    res.json(helper.readData());
});

router.post('/', authenticate, authorized, function (req, res, next) {
    let body = req.body
    res.json(helper.writeData(body));
});

module.exports = router;