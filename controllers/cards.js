const Cards = require('../models/card');

const getAllCards = (req, res) => {
  Cards.find({})
    .then((cards) => res.send(cards))
    .catch((err) => {
      res.status(500).send(`Ошибка на сервере ${err.name}: ${err.message}`);
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Cards.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
        return;
      }
      res.status(500).send(`Ошибка на сервере ${err.name}: ${err.message}`);
    });
};

const deleteCardById = (req, res) => {
  const { cardId } = req.params;
  Cards.findByIdAndDelete(cardId)
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
        return;
      }
      res.status(500).send(`Ошибка на сервере ${err.name}: ${err.message}`);
    });
};

const putCardLike = (req, res) => {
  const { cardId } = req.params;
  Cards.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError' && err.message.indexOf('_id') >= 0) {
        res.status(404).send({ message: 'Передан несуществующий_id карточки' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка' });
        return;
      }
      res.status(500).send(`Ошибка на сервере ${err.name}: ${err.message}`);
    });
};

const deleteCardLike = (req, res) => {
  const { cardId } = req.params;
  Cards.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError' && err.message.indexOf('_id') >= 0) {
        res.status(404).send({ message: 'Передан несуществующий_id карточки' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка' });
        return;
      }
      res.status(500).send(`Ошибка на сервере ${err.name}: ${err.message}`);
    });
};

module.exports = {
  getAllCards, createCard, deleteCardById, putCardLike, deleteCardLike,
};
