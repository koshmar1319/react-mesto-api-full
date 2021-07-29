const User = require('../models/user');

const ERROR_CODE_BAD_REQUEST = 400;
const ERROR_CODE_NOT_FOUND = 404;
const ERROR_CODE_DEFAULT = 500;

const getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => {
      res.status(ERROR_CODE_DEFAULT).send({ message: 'Что-то пошло не так' });
    });
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      const error = new Error('Пользователь с заданным идентификатором отсутствует в базе данных');
      error.statusCode = ERROR_CODE_NOT_FOUND;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === ERROR_CODE_NOT_FOUND) {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      } else {
        res.status(ERROR_CODE_DEFAULT).send({ message: 'Что-то пошло не так' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(ERROR_CODE_DEFAULT).send({ message: 'Что-то пошло не так' });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { name, about }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .orFail(() => {
      const error = new Error('Пользователь с заданным идентификатором отсутствует в базе данных');
      error.statusCode = ERROR_CODE_NOT_FOUND;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === ERROR_CODE_NOT_FOUND) {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      } else if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else {
        res.status(ERROR_CODE_DEFAULT).send({ message: 'Что-то пошло не так' });
      }
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { avatar }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .orFail(() => {
      const error = new Error('Пользователь с заданным идентификатором отсутствует в базе данных');
      error.statusCode = ERROR_CODE_NOT_FOUND;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === ERROR_CODE_NOT_FOUND) {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
      } else if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      } else {
        res.status(ERROR_CODE_DEFAULT).send({ message: 'Что-то пошло не так' });
      }
    });
};

module.exports = {
  getAllUsers, getUser, createUser, updateUser, updateUserAvatar,
};
