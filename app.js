const express = require('express');
const mongoose = require('mongoose');
const { Joi, celebrate, errors } = require('celebrate');
const { ERROR_CODE_NOT_FOUND } = require('./utils/constants');
const { createUser, login } = require('./controllers/users');
const { handleError, ErrorState } = require('./middlewares/errors');
const auth = require('./middlewares/auth');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.json());

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

app.use(auth);
app.use('/', usersRouter);
app.use('/', cardsRouter);

app.use((req, res, next) => {
  next(new ErrorState('Указанный путь не существует', ERROR_CODE_NOT_FOUND));
});

app.use(errors());

app.use(handleError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
