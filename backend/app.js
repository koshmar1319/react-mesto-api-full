const dotenv = require('dotenv');

dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { Joi, celebrate, errors } = require('celebrate');
const { ERROR_CODE_NOT_FOUND } = require('./utils/constants');
const { createUser, login, logout } = require('./controllers/users');
const { handleError, ErrorState } = require('./middlewares/errors');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const app = express();

const { PORT, NODE_ENV } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const allowedCors = [
  'https://kshmr-mesto.nomoredomains.monster',
  'http://kshmr-mesto.nomoredomains.monster',
  'http://localhost:3000',
];

app.use((req, res, next) => {
  const { origin } = req.headers;
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }

  const { method } = req;

  const ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  const requestHeaders = req.headers['access-control-request-headers'];

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  next();
});

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(4),
  }),
}), createUser);

app.delete('/logout', logout);

app.use(auth);
app.use('/', usersRouter);
app.use('/', cardsRouter);

app.use((req, res, next) => {
  next(new ErrorState('Указанный путь не существует', ERROR_CODE_NOT_FOUND));
});

app.use(errorLogger);

app.use(errors());

app.use(handleError);

app.listen(NODE_ENV === 'production' ? PORT : 3001);
