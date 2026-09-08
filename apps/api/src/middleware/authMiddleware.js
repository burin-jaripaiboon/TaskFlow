const jwt = require('jsonwebtoken');
const AppError = require('../utilities/AppError');

exports.protect = (request, response, next) => {
  const authHeader = request.header('Authorization');
  
  // Tokens are usually sent in the format: "Bearer eyJhbGciOi..."
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return response.status(401).json({ success: false, message: 'No token, authorization denied' });
  }

  try {
    const accessToken = authHeader.split(' ')[1];
    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    request.user = decoded.userId;
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      const accessExpiredError = new AppError(`Access timeout. Retrying...`, 401);
      accessExpiredError.errorCode = 'ACCESS_TOKEN_EXPIRED';
      throw accessExpiredError;
    }
    throw new AppError(`Invalid Token!`, 401);
  }
};
