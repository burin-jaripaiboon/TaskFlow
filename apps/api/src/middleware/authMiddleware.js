const jwt = require('jsonwebtoken');

exports.protect = (request, response, next) => {
  const authHeader = request.header('Authorization');
  
  // Tokens are usually sent in the format: "Bearer eyJhbGciOi..."
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return response.status(401).json({ success: false, message: 'No token, authorization denied' });
  }

  try {
    const token = authHeader.split(' ')[1];
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    request.user = decoded.userId;
    
    next();
  } catch (error) {
    response.status(401).json({ success: false, message: 'Token is not valid' });
  }
};