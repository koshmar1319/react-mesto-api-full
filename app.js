const express = require('express');
const mongoose = require('mongoose');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const app = express();

const { PORT = 3000 } = process.env;
const ERROR_CODE_NOT_FOUND = 404;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '6101770588477f0614ddc7a5',
  };
  next();
});

app.use('/', usersRouter);
app.use('/', cardsRouter);

app.use((req, res) => {
  res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Такого пути не существует' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
