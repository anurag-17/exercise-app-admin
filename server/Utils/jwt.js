const jwt = require("jsonwebtoken");

exports.generateToken = (payload, expiresIn = '12h') => {
    console.log(payload);
    return jwt.sign(payload, process.env.jwtKey, { expiresIn });
};
exports.generateTokenForPwd = (payload, expiresIn = '5m') => {
    console.log(payload);
    return jwt.sign(payload, process.env.jwtKey, { expiresIn });
};
exports.verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.jwtKey);
        return decoded;
    } catch (error) {
        // Handle invalid/expired tokens here
        return null;
    }
}