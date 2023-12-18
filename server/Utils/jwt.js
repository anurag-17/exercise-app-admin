const jwt = require("jsonwebtoken");
const User = require("../Model/User");
const Admin = require("../Model/Admin");

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
exports.isAuthJWT = (async (req, res, next) => {
    const authHeader = req.headers.authorization;
    let token = '';

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    } else {
        token = authHeader
    }
    // console.log(token);
    if (!token) {
      return res
        .status(401)
        .json({ message: "Please login to access this resource" });
    } else {
      const decodedData = jwt.verify(token, process.env.jwtKey);
    //   console.log(decodedData);
    if (!decodedData) {
        return res
        .status(HttpStatus.BAD_REQUEST)
        .json(StatusMessage.USER_NOT_FOUND);
      }
      req.user = await User.findOne({email:decodedData?.email});
      if (req.user === null) {
        req.user = await Admin.findOne({email:decodedData?.email});
      }
      next();
    }
  });

// auth role
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          res.status(403).json(
            `Role: ${req.user.role} is not allowed  to access this resource`
          )
        );
      }
      next();
    };
  };