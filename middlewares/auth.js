const jwt = require('jsonwebtoken');
const { ERROR_CODE_UNAUTHORIZED } = require('../utils/constants');
const { ErrorState } = require('./errors');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    next(new ErrorState('Пользователь не авторизован', ERROR_CODE_UNAUTHORIZED));
  }
  const token = authorization.split(' ')[1];
  let payload;
  try {
    payload = jwt.verify(token, 'secret');
  } catch (error) {
    next(new ErrorState('Пользователь не авторизован', ERROR_CODE_UNAUTHORIZED));
  }
  req.user = payload;
  return next();
};

module.exports = auth;
