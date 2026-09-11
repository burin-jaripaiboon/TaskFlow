module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';
  if (err.statusCode === 500) {
    console.error('💥 FATAL ERROR:', err);
  }
  if (err.errorCode === 'REFRESH_TOKEN_EXPIRED') {
    res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  }
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    ...(err.errorCode && { errorCode: err.errorCode })
  });
}
