const { JWT_SECRET, NODE_ENV } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
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

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => next(new ErrorState('Что-то пошло не так', ERROR_CODE_DEFAULT)));
};

const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new ErrorState('Пользователь с заданным идентификатором отсутствует в базе данных', ERROR_CODE_NOT_FOUND);
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === ERROR_CODE_NOT_FOUND) {
        return next(err);
      }
      if (err.name === 'CastError') {
        return next(new ErrorState('Переданы некорректные данные при получении пользователя', ERROR_CODE_BAD_REQUEST));
      }
      return next(new ErrorState('Что-то пошло не так', ERROR_CODE_DEFAULT));
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  // const validEmail = validator.isEmail(email, {
  //   allow_display_name: false,
  //   require_display_name: false,
  //   allow_utf8_local_part: true,
  //   require_tld: true,
  //   allow_ip_domain: false,
  //   domain_specific_validation: false,
  //   blacklisted_chars: '',
  // });

  // const validPassword = validator.isStrongPassword(password, {
  //   minLength: 4,
  //   minLowercase: 1,
  //   minUppercase: 1,
  //   minNumbers: 1,
  //   minSymbols: 1,
  //   returnScore: false,
  // });

  // if (!validEmail) {
  //   return next(new ErrorState('Некорректная электронная почта', ERROR_CODE_BAD_REQUEST));
  // }

  // if (!validPassword) {
  //   return next(new ErrorState('Некорректный пароль! Пароль не может быть меньше 4 знаков! Также пароль должен содержать буквы верхнего и нижнего регистра, цифры и символы', ERROR_CODE_BAD_REQUEST));
  // }

  const hashPassword = bcrypt.hashSync(password, 10);

  return User.create({
    name, about, avatar, email, password: hashPassword,
  })
    .then((user) => res.send({ data: user.toJSON() }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ErrorState('Переданы некорректные данные при создании пользователя', ERROR_CODE_BAD_REQUEST));
      }
      if (err.name === 'MongoError' && err.code === 11000) {
        return next(new ErrorState('Пользователь уже существует', ERROR_CODE_CONFLICT));
      }
      return next(new ErrorState('Что-то пошло не так', ERROR_CODE_DEFAULT));
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { name, about }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .orFail(() => {
      next(new ErrorState('Пользователь с заданным идентификатором отсутствует в базе данных', ERROR_CODE_NOT_FOUND));
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === ERROR_CODE_NOT_FOUND) {
        return next(err);
      }
      if (err.name === 'ValidationError') {
        return next(new ErrorState('Переданы некорректные данные при обновлении профиля', ERROR_CODE_BAD_REQUEST));
      }
      if (err.name === 'CastError') {
        return next(new ErrorState('Переданы некорректные данные при обновлении профиля', ERROR_CODE_BAD_REQUEST));
      }
      return next(new ErrorState('Что-то пошло не так', ERROR_CODE_DEFAULT));
    });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  if (!avatar.trim()) {
    next(new ErrorState('Переданы некорректные данные при обновлении аватара', ERROR_CODE_BAD_REQUEST));
  }
  User.findByIdAndUpdate(userId, { avatar }, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .orFail(() => {
      next(new ErrorState('Пользователь с заданным идентификатором отсутствует в базе данных', ERROR_CODE_NOT_FOUND));
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === ERROR_CODE_NOT_FOUND) {
        return next(err);
      }
      if (err.name === 'ValidationError') {
        return next(new ErrorState('Переданы некорректные данные при обновлении аватара', ERROR_CODE_BAD_REQUEST));
      }
      if (err.name === 'CastError') {
        return next(new ErrorState('Переданы некорректные данные при обновлении аватара', ERROR_CODE_BAD_REQUEST));
      }
      return next(new ErrorState('Что-то пошло не так', ERROR_CODE_DEFAULT));
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .orFail(() => {
      throw new ErrorState('Пользователь не существует', ERROR_CODE_UNAUTHORIZED);
    })
    .then((user) => {
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            const error = new ErrorState('Неправильный логин или пароль', ERROR_CODE_UNAUTHORIZED);
            throw error;
          }
          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : randomString, { expiresIn: '7d' });
          res.status(200).cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
            domain: '.nomoredomains.monster',
            secure: true,
            path: '/',
            sameSite: 'None',
          })
            .send({ message: 'Вы успешно авторизовались!' })
        })
        .catch((err) => {
          if (err.statusCode === ERROR_CODE_UNAUTHORIZED) {
            next(err);
          } else {
            next(new ErrorState('Что-то пошло не так', ERROR_CODE_DEFAULT));
          }
        });
    })
    .catch((err) => {
      if (err.statusCode === ERROR_CODE_UNAUTHORIZED) {
        return next(err);
      }
      return next(new ErrorState('Что-то пошло не так', ERROR_CODE_DEFAULT));
    });
};

const logout = (req, res, next) => {
  const { email } = req.body;
  const { jwt } = req.cookies;

  let verifiedUser = null;

  if (!jwt) {
    return next(new ErrorState('Некорректные данные авторизации!', ERROR_CODE_UNAUTHORIZED));
  }

  const user = User.findOne({ email });

  if (!user) {
    throw new ErrorState('Пользователь не существует', ERROR_CODE_UNAUTHORIZED);
  }

  jwt.verify(jwt, NODE_ENV === 'production' ? JWT_SECRET : randomString, (err, payload) => {
    if (err) {
      throw new ErrorState('Некорректные данные авторизации!', ERROR_CODE_UNAUTHORIZED);
    }
    verifiedUser = payload;

    if (user._id.toHexString() !== verifiedUser._id) {
      throw new ErrorState('Некорректные данные авторизации!', ERROR_CODE_UNAUTHORIZED);
    }
  });
  res.status(200).clearCookie('jwt', {
    httpOnly: true,
    domain: '.nomoredomains.monster',
    secure: true,
    path: '/',
  })
    .send({ message: 'Вы вышли из системы!' })
}

const getCurrentUser = (req, res, next) => {
  const { user } = req;
  User.findById(user._id)
    .orFail(() => {
      next(new ErrorState('Пользователь с заданным идентификатором отсутствует в базе данных', ERROR_CODE_NOT_FOUND));
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.statusCode === ERROR_CODE_NOT_FOUND) {
        return next(err);
      }
      if (err.name === 'CastError') {
        return next(new ErrorState('Переданы некорректные данные при получении пользователя', ERROR_CODE_BAD_REQUEST));
      }
      return next(new ErrorState('Что-то пошло не так', ERROR_CODE_DEFAULT));
    });
};

module.exports = {
  getAllUsers, getUser, createUser, updateUser, updateUserAvatar, login, logout, getCurrentUser,
};
