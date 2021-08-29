const { NODE_ENV, JWT_SECRET = 'secret-key' } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  ERROR_CODE_BAD_REQUEST,
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_DEFAULT,
  ERROR_CODE_UNAUTHORIZED,
  ERROR_CODE_CONFLICT,
} = require('../utils/constants');
const { ErrorState } = require('../middlewares/errors');

const randomString = 'secret';

const signOut = (req, res) => res.clearCookie('jwt').send({ message: 'Куки очищены' });

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : randomString,
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .status(200)
        .send({ data: user.toJSON() });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({ data: user.toJSON() }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorState('Переданы некорректные данные при создании пользователя', ERROR_CODE_BAD_REQUEST));
      }
      if (err.name === 'MongoError' && err.code === 11000) {
        next(new ErrorState('Пользователь уже существует', ERROR_CODE_CONFLICT));
      } else {
        next(err);
      }
    });
};

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((data) => res.send(data))
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => next(new ErrorState('Пользователь с заданным идентификатором отсутствует в базе данных', ERROR_CODE_NOT_FOUND)))
    .then((data) => res.send(data))
    .catch((err) => {
      if (err.name === 'CastError') next(new ErrorState('Переданы некорректные данные при получении пользователя', ERROR_CODE_BAD_REQUEST));
    });
};

const getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => next(new ErrorState('Пользователь с заданным идентификатором отсутствует в базе данных', ERROR_CODE_NOT_FOUND)))
    .then((data) => res.send({ data }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorState('Переданы некорректные данные при получении пользователя', ERROR_CODE_BAD_REQUEST));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => next(new ErrorState('Пользователь с заданным идентификатором отсутствует в базе данных', ERROR_CODE_NOT_FOUND)))
    .then((data) => res.send(data))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorState('Переданы некорректные данные при получении пользователя', ERROR_CODE_BAD_REQUEST));
      } else {
        next(err);
      }
    });
};

const updateUserAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => next(new ErrorState('Пользователь с заданным идентификатором отсутствует в базе данных', ERROR_CODE_NOT_FOUND)))
    .then((data) => res.send(data))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorState('Переданы некорректные данные при получении пользователя', ERROR_CODE_BAD_REQUEST));
      } else {
        next(err);
      }
    });
};


module.exports = {
  getAllUsers, getUser, createUser, updateUser, updateUserAvatar, login, getCurrentUser, signOut,
};
