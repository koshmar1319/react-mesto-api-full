const Card = require('../models/card');
const {
  ERROR_CODE_BAD_REQUEST,
  ERROR_CODE_FORBIDDEN,
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_DEFAULT,
} = require('../utils/constants');
const { ErrorState } = require('../middlewares/errors');

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((data) => res.send(data))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorState('Переданы некорректные данные при создании карточки', ERROR_CODE_BAD_REQUEST));
      } else {
        next(err);
      }
    });
};

const getAllCards = (req, res, next) => {
  Card.find({})
    .then((data) => res.send(data))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const currentUser = req.user._id;
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(() => next(new ErrorState('Карточка с указанным идентификатором не найдена', ERROR_CODE_NOT_FOUND)))
    .then((card) => {
      if (!card.owner.equals(currentUser)) {
        next(new ErrorState('У вас нет доступа для осуществления данных действий', ERROR_CODE_FORBIDDEN));
      } else {
        Card.findByIdAndRemove(cardId)
          .then((data) => res.send({
            data,
            message: 'Карточка удалена',
          }))
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorState('Переданы некорректные данные при удалении карточки', ERROR_CODE_BAD_REQUEST));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => next(new ErrorState('Карточка с указанным идентификатором не найдена', ERROR_CODE_NOT_FOUND)))
    .then((data) => res.send(data))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorState('Переданы некорректные данные для постановки лайка', ERROR_CODE_BAD_REQUEST));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => next(new ErrorState('Карточка с указанным идентификатором не найдена', ERROR_CODE_NOT_FOUND)))
    .then((data) => res.send(data))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorState('Переданы некорректные данные для снятия лайка', ERROR_CODE_BAD_REQUEST));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getAllCards, createCard, deleteCard, likeCard, dislikeCard,
};
