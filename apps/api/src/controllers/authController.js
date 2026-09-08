const authService = require('../services/authService');

exports.register = async (request, response) => {
  const { name, email, password } = request.body;
  const { accessToken, deviceToken, expiresAt } = await authService.registerUser({ name, email, password });
  response.cookie('deviceToken', deviceToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: expiresAt
  });
  response.status(201).json({ success: true, accessToken });
};

exports.login = async (request, response) => {
  const { identifier, password } = request.body;
  const { accessToken, deviceToken, expiresAt } = await authService.loginUser({ identifier, password });
  response.cookie('deviceToken', deviceToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: expiresAt
  });
  response.status(201).json({ success: true, accessToken });
};

exports.logout = async (request, response) => {
  const deviceToken = request.cookies.deviceToken;
  await authService.logoutUser(deviceToken);
  response.clearCookie('deviceToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  response.status(201).json({ success: true });
};

exports.renewTokens = async (request, response) => {
  const oldDeviceToken = request.cookies.deviceToken;
  const { deviceToken, accessToken, expiresAt } = await authService.renewTokens(oldDeviceToken);
  response.cookie('deviceToken', deviceToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: expiresAt
  });
  response.status(201).json({ success: true, accessToken });
}


