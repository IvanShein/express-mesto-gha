const Cards = require('../models/card');

const getAllCards = (req, res) => {
  Cards.find({})
    .then((cards) => res.send(cards))
    .catch((err) => {
      res.status(500).send(err.message);
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Cards.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
        return;
      }
      res.status(500).send(err.message);
    });
};

const deleteCardById = (req, res) => {
  const { cardId } = req.params;
  Cards.findByIdAndDelete(cardId)
    .orFail(() => {
      res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
    })
    .then((card) => res.send(card))
    .catch((err) => {
      res.status(500).send(err.message);
    });
};

const putCardLike = (req, res) => {
  const { cardId } = req.params;
  Cards.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      res.status(404).send({ message: 'Передан несуществующий_id карточки' });
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка' });
        return;
      }
      res.status(500).send(err.message);
    });
};

const deleteCardLike = (req, res) => {
  const { cardId } = req.params;
  Cards.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      res.status(404).send({ message: 'Передан несуществующий_id карточки' });
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка' });
        return;
      }
      res.status(500).send(err.message);
    });
};

module.exports = {
  getAllCards, createCard, deleteCardById, putCardLike, deleteCardLike,
};
