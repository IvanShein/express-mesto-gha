const User = require('../models/user');

const getAllUsers = async (req, res) => {
  const users = await User.find({});

  res.send(users);
};

const getUserById = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  res.send(user);
};

const createUser = async (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      console.log(err);

      res.status(500);
      res.send(err.message);
    });
};

module.exports = { getAllUsers, getUserById, createUser };
