const Card = require('../models/card');

const ERROR_CODE_BAD_REQUEST = 400;
const ERROR_CODE_NOT_FOUND = 404;
const ERROR_CODE_DEFAULT = 500;

const getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(() => {
      res.status(ERROR_CODE_DEFAULT).send({ message: 'Что-то пошло не так' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(ERROR_CODE_DEFAULT).send({ message: 'Что-то пошло не так' });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      const error = new Error('Карточка с заданным идентификатором отсутствует в базе данных');
      error.statusCode = ERROR_CODE_NOT_FOUND;
      throw error;
    })
    .then((card) => {
      card.remove();
      res.status(200).send('Карточка удалена');
    })
    .catch((err) => {
      if (err.statusCode === ERROR_CODE_NOT_FOUND) {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Карточка с указанным идентификатором не найдена' });
      } else {
        res.status(ERROR_CODE_DEFAULT).send({ message: 'Что-то пошло не так' });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      const error = new Error('Карточка с заданным идентификатором отсутствует в базе данных');
      error.statusCode = ERROR_CODE_BAD_REQUEST;
      throw error;
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.statusCode === ERROR_CODE_BAD_REQUEST) {
        res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка' });
      } else {
        res.status(ERROR_CODE_DEFAULT).send({ message: 'Что-то пошло не так' });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      const error = new Error('Карточка с заданным идентификатором отсутствует в базе данных');
      error.statusCode = ERROR_CODE_BAD_REQUEST;
      throw error;
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.statusCode === ERROR_CODE_BAD_REQUEST) {
        res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятия лайка' });
      } else {
        res.status(ERROR_CODE_DEFAULT).send({ message: 'Что-то пошло не так' });
      }
    });
};

module.exports = {
  getAllCards, createCard, deleteCard, likeCard, dislikeCard,
};
