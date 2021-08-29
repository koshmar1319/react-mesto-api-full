const jwt = require('jsonwebtoken');
const { JWT_SECRET = 'secret-key', NODE_ENV } = process.env;
const { ERROR_CODE_UNAUTHORIZED } = require('../utils/constants');
const { ErrorState } = require('./errors');

const randomString = 'secret';

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  const secretKey = NODE_ENV === 'production' ? JWT_SECRET : randomString;

  try {
    const payload = jwt.verify(token, secretKey);
    req.user = payload;
  } catch (err) {
    throw new ErrorState('Некорректные данные авторизации!', ERROR_CODE_UNAUTHORIZED);
  }

  next();
};

module.exports = auth;
