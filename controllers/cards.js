const Cards = require('../models/card');

const getAllCards = (req, res) => {
  Cards.find({})
    .then((cards) => res.send(cards))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err.message);
    })
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Cards.create({ name, link, owner: '642af7416c984cbff216fcd3' })
    .then((card) => res.send(card))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err.message);
    });
};

const deleteCardById = (req, res) => {
  const { cardId } = req.params;
  Cards.findByIdAndDelete(cardId)
    .orFail(() => {
      res.status(404).send("Not found");
    })
    .then((card) => res.send(card))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err.message);
    })
};

module.exports = { getAllCards, createCard, deleteCardById };
