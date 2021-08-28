const Card = require('../models/card');
const {
  ERROR_CODE_BAD_REQUEST,
  ERROR_CODE_FORBIDDEN,
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_DEFAULT,
} = require('../utils/constants');
const { ErrorState } = require('../middlewares/errors');

const getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(() => next(new ErrorState('Что-то пошло не так', ERROR_CODE_DEFAULT)));
};

// const getAllCards = (req, res, next) => {
//   try {
//     const cards = Card.find({}).populate(['likes', 'owner']).sort('-createdAt');
//     res.send(cards);
//   } catch (error) {
//     next(error);
//   }
// }

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  // const owner = req.user._id;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ErrorState('Переданы некорректные данные при создании карточки', ERROR_CODE_BAD_REQUEST));
      }
      return next(new ErrorState('Что-то пошло не так', ERROR_CODE_DEFAULT));
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new ErrorState('Карточка с указанным идентификатором не найдена', ERROR_CODE_NOT_FOUND);
    })
    .then((card) => {
      if (req.user._id !== card.owner.toString()) {
        next(new ErrorState('У вас нет доступа для осуществления данных действий', ERROR_CODE_FORBIDDEN));
      } else {
        card.remove();
        res.status(200).send({ message: 'Карточка удалена' });
      }
    })
    .catch((err) => {
      if (err.statusCode === ERROR_CODE_NOT_FOUND) {
        return next(err);
      }
      if (err.name === 'CastError') {
        return next(new ErrorState('Переданы некорректные данные при удалении карточки', ERROR_CODE_BAD_REQUEST));
      }
      return next(new ErrorState('Что-то пошло не так', ERROR_CODE_DEFAULT));
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new ErrorState('Карточка с указанным идентификатором не найдена', ERROR_CODE_NOT_FOUND);
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.statusCode === ERROR_CODE_NOT_FOUND) {
        return next(err);
      }
      if (err.name === 'CastError') {
        return next('Переданы некорректные данные для постановки лайка', ERROR_CODE_BAD_REQUEST);
      }
      return next('Что-то пошло не так', ERROR_CODE_DEFAULT);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new ErrorState('Карточка с указанным идентификатором не найдена', ERROR_CODE_NOT_FOUND);
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.statusCode === ERROR_CODE_NOT_FOUND) {
        return next(err);
      }
      if (err.name === 'CastError') {
        return next(new ErrorState('Переданы некорректные данные для снятия лайка', ERROR_CODE_BAD_REQUEST));
      }
      return next(new ErrorState('Что-то пошло не так', ERROR_CODE_DEFAULT));
    });
};

module.exports = {
  getAllCards, createCard, deleteCard, likeCard, dislikeCard,
};
