const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NotFoundError } = require('../errors/not-found-err');
const { CastError } = require('../errors/cast-err');
const { ExistFieldError } = require('../errors/exist-field-err');
const { ValidationError } = require('../errors/validation-err');

const signOut = (req, res) => res.clearCookie('jwt').send({ message: 'Куки очищены' });

const login = (req, res, next) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET = 'secret-key', JWT_DEV = 'dev-key' } = process.env;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : JWT_DEV,
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
        next(new ValidationError('Переданы некорректные данные при создании пользователя'));
      }
      if (err.name === 'MongoError' && err.code === 11000) {
        next(new ExistFieldError('Email уже существует'));
      } else {
        next(err);
      }
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((data) => res.send(data))
    .catch(next);
};

const getMe = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => next(new NotFoundError('Пользователь по указанному _id не найден')))
    .then((data) => res.send(data))
    .catch((err) => {
      if (err.name === 'CastError') next(new CastError('Невалидный id пользователя'));
    });
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => next(new NotFoundError('Пользователь по указанному _id не найден')))
    .then((data) => res.send({ data }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Невалидный id пользователя'));
      } else {
        next(err);
      }
    });
};

const updateProfile = (req, res, next) => {
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
    .orFail(() => next(new NotFoundError('Пользователь по указанному _id не найден')))
    .then((data) => res.send(data))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Невалидный id пользователя'));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
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
    .orFail(() => next(new NotFoundError('Пользователь по указанному _id не найден')))
    .then((data) => res.send(data))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Невалидный id пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  login,
  getMe,
  signOut,
};
