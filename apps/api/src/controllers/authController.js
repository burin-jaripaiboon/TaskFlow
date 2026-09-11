const authService = require('../services/authService');

exports.register = async (request, response) => {
  const { name, email, password } = request.body;
  const { accessToken, refreshToken, expiresAt } = await authService.registerUser({ name, email, password });
  response.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: expiresAt
  });
  response.status(201).json({ success: true, accessToken });
};

exports.login = async (request, response) => {
  const { identifier, password } = request.body;
  const { accessToken, refreshToken, expiresAt } = await authService.loginUser({ identifier, password });
  response.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: expiresAt
  });
  response.status(201).json({ success: true, accessToken });
};

exports.logout = async (request, response) => {
  const refreshToken = request.cookies.refreshToken;
  await authService.logoutUser(refreshToken);
  response.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  response.status(201).json({ success: true });
};

exports.refreshTokens = async (request, response) => {

  const oldRefreshToken = request.cookies.refreshToken;
  const { refreshToken, accessToken, expiresAt } = await authService.refreshTokens(oldRefreshToken);
  response.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: expiresAt
  });
  response.status(201).json({ success: true, accessToken });
}


