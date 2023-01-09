global.tokens = {};
global.users = {};

const getUser = (token) => {
    if(global.tokens[token]) return global.users[global.tokens[token]];
    return ;
}

const putUser = (token, user) => {
    global.users[user.id] = user;
    global.tokens[token] = user.id;
}

module.exports = {
    getUser: getUser,
    putUser: putUser
}