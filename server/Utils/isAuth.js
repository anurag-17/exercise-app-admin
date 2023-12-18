// auth user
const isAuthuser = async (req, res, next) => {
    const  authHeader  = req.headers.authorization;
    console.log(token);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(HttpStatus.UNAUTHORIZED).json("Unauthorized access.");
      }
      const token = authHeader.slice(7); // Extracting the token

      // Your token validation logic here (verifyToken function)
      if (!verifyToken(token)) {
        return res.status(HttpStatus.UNAUTHORIZED).json("Invalid token.");
      }
    
    //   next();
    
  };
  export default isAuthuser