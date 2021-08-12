const { ERROR_CODE_DEFAULT } = require('../utils/constants');

class ErrorState extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const handleError = (err, req, res, next) => {
  const { message, statusCode = ERROR_CODE_DEFAULT } = err;
  res.status(statusCode).send({
    message: statusCode === ERROR_CODE_DEFAULT ? 'Произошла ошибка сервера' : message,
  });
  next();
};

module.exports = { ErrorState, handleError };
