const Users = require('../models/user');

const getAllUsers = (req, res) => {
  Users.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err.message);
    })
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  Users.findById(userId)
    .orFail(() => {
      res.status(404).send("Not found");
    })
    .then((user) => res.send(user))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err.message);
    })
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  Users.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err.message);
    });
};

module.exports = { getAllUsers, getUserById, createUser };
