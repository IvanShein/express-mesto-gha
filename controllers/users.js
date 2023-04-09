const mongoose = require('mongoose');
const Users = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getAllUsers = (req, res) => {
  Users.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      res.status(500).send({ message: `Ошибка на сервере ${err.name}: ${err.message}` });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  Users.findById(userId)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(400).send({ message: 'Пользователь по указанному _id не найден' });
        return;
      }
      res.status(500).send({ message: `Ошибка на сервере ${err.name}: ${err.message}` });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then(hash => {
      Users.create({ name, about, avatar, email, password: hash })
        .then((user) => {
          res.status(201).send({
            _id: user._id,
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
          })
        })
        .catch((err) => {
          if (err instanceof mongoose.Error.ValidationError) {
            res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
            return;
          }
          res.status(500).send({ message: `Ошибка на сервере ${err.name}: ${err.message}` });
        });
    });

  const updateUser = (req, res) => {
    const { name, about } = req.body;
    Users.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
      .then((user) => {
        if (user) {
          res.send(user);
        } else {
          res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
        }
      })
      .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
          res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
          return;
        }
        res.status(500).send({ message: `Ошибка на сервере ${err.name}: ${err.message}` });
      });
  };

  const updateAvatar = (req, res) => {
    const { avatar } = req.body;
    Users.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
      .then((user) => {
        if (user) {
          res.send(user);
        } else {
          res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
        }
      })
      .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
          res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
          return;
        }
        res.status(500).send({ message: `Ошибка на сервере ${err.name}: ${err.message}` });
      });
  };

  const login = (req, res) => {
    const { email, password } = req.body;

    return User.findUserByCredentials(email, password)
      .then((user) => {

        const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: 7d });

        res.cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true
        })
          .end();
      })
      .catch((err) => {
        res
          .status(401)
          .send({ message: err.message });
      });
  };

  module.exports = {
    getAllUsers, getUserById, createUser, updateUser, updateAvatar,
  };
