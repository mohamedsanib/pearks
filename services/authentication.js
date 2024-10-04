const JWT = require('jsonwebtoken');
const JWT_SECRET = "$ECRET";

function createTokenForUsers(user){
    const payload = {
        name : user.fullName,
        _id : user._id,
        email : user.email,
        profileImageUrl : user.profileImageUrl,
        role : user.role
    }
    const token = JWT.sign(payload, JWT_SECRET);
    return token;
}

function validateToken(token){
    const payload = JWT.verify(token, JWT_SECRET);
    return payload;
}

module.exports = {
    createTokenForUsers,
    validateToken
}
