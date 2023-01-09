const express = require('express');
const users = require('../data/users');
const { putUser } = require('./redis');
let app = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const privateKey = "the-super-strong-secrect";

app.post('/', async function (req, res) {
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
                    msg: 'Logged in!',
                    token,
                    user: user
                });
            } else throw { status: 401, message: "userid or password is incorrect" };
        } else throw { message: 'username and password is mandatory' }
    } catch (error) {
        console.log(error)
        res.status(error.status).json({message:error.message});
    }
});

// const createUsers = () => {

//     let users = ['userA','userB','userC'];
//     users.forEach(user=>{
//         bcrypt.hash(user+'12345', 10).then(function(hash) {
//             console.log(user, hash);
//         });
//     })
// }
// createUsers();

module.exports = app