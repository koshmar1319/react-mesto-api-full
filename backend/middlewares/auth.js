
const jsonwebtoken = require('jsonwebtoken');
const { ERROR_CODE_UNAUTHORIZED } = require('../utils/constants');
const { ErrorState } = require('./errors');

// const auth = (req, res, next) => {
//   const { authorization } = req.headers;
//   if (!authorization) {
//     next(new ErrorState('Пользователь не авторизован', ERROR_CODE_UNAUTHORIZED));
//   }
// const token = authorization.split(' ')[1];
//   const token = authorization.replace('Bearer ', '');
//   let payload;
//   try {
//     payload = jwt.verify(token, JWT_SECRET);
//   } catch (error) {
//     next(new ErrorState('Пользователь не авторизован', ERROR_CODE_UNAUTHORIZED));
//   }
//   req.user = payload;
//   return next();
// };

const randomString = 'secret';

const auth = (req, res, next) => {
  const { jwt } = req.cookies;
  const { JWT_SECRET = 'secret-key', NODE_ENV } = process.env;

  try {
    if (!jwt) {
      throw new ErrorState('Пользователь не авторизован', ERROR_CODE_UNAUTHORIZED);
    }
  } catch (error) {
    next(error);
  }

  try {
    jsonwebtoken.verify(jwt, NODE_ENV === 'production' ? JWT_SECRET : randomString, (err, payload) => {
      if (err) {
        throw new ErrorState('Пользователь не авторизован', ERROR_CODE_UNAUTHORIZED);
      }
      req.user = payload;
      next();
    });
  } catch (error) {
    next(error);
  }
};

// const auth = (req, res, next) => {
//   const token = req.cookies.jwt;
//   const secretKey = NODE_ENV === 'production' ? JWT_SECRET : randomString;
//   try {
//     const payload = jwt.verify(token, secretKey);
//     req.user = payload;
//   } catch (error) {
//     next(new ErrorState('Пользователь не авторизован', ERROR_CODE_UNAUTHORIZED));
//   }

//   next();
// }

module.exports = auth;
