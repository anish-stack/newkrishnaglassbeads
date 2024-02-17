const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authenticateUser = async (req, res, next) => {
  try {
    // Get the token from the request header or cookies
    const token = req.header('Authorization') || req.cookies.token;

    if (!token) {
      return res.status(401).json({
        status: false,
        message: 'Unauthorized: No token provided',
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user based on the decoded user ID
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        status: false,
        message: 'Unauthorized: Invalid token',
      });
    }

    // Attach the user object to the request for further use in routes
    req.user = user;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      status: false,
      message: 'Unauthorized: Invalid token',
    });
  }
};

module.exports = authenticateUser;
