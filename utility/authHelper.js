const { getUser } = require("../controllers/redis");

const authenticate = (req, res, next) => {
    let headers = req.headers;
    if(headers.authorization && getUser(headers.authorization)){
        next();
    }else res.status(400).json({message:"Un-authenticated"})
    
}

const authorized = (req, res, next) => {
    let headers = req.headers;
    let user = getUser(headers.authorization);

    if(user.authorized){
        next();
    }else res.status(400).json({message:"Un-authorized"})
    
}

module.exports = {
    authenticate: authenticate,
    authorized: authorized
}