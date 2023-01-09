const users = [{
    "id":"userA",
    "password":"$2a$10$biJ2AFOAVasymJaQQyMm5u6.2fa5ZiRg401AIBSbDBZyKad6mgpdS"
},{
    "id":"userB",
    "password":"$2a$10$jrvGsBuq49SQAbnb9vvJZ.uNPWo..5FyDGcC/hQo7M4ENwR5U1dSq",
    "authorized" : true
},{
    "id":"userC",
    "password":"$2a$10$XbZ7nNsvCF6898C.Kwha9uEISMdzDP7vSaWnjpEmRQn3tK/imcTbK"
}]

const getDBUser = (userId) => {
    let user = users.filter(user=> user.id == userId);
    return user[0];
}

module.exports = {
    getDBUser: getDBUser
}