const express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
mongoose.model("api.security.accounts", {});
router.post('/unsecure', function (req, res, next) {
    let body = req.body;
    let filter= {
        username : body.username,
        password: body.password
    }
    mongoose.model('api.security.accounts').find(filter)
    .then(records=>{
        res.json(records);
    })
});

// router.post('/unsecure2', function (req, res, next) {
//     let body = req.body;
//     mongoose.model('api.security.accounts').find(body)
//     .then(records=>{
//         res.json(records);
//     })
// });

router.post('/secure', function (req, res, next) {
    let body = req.body;
    let filter= {
        username : new String(body.username),
        password: new String(body.password)
    }
    mongoose.model('api.security.accounts').find(filter)
    .then(records=>{
        res.json(records);
    })
    
});

module.exports = router