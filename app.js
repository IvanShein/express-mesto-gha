const express = require('express');
const mongoose = require('mongoose');
const { createUser, login } = require('./controllers/users');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log('Connected with DB');
  })
  .catch((error) => {
    console.log(`Error during connection with DB ${error}`);
  });

  app.use((req, res, next) => {
  req.user = {
    _id: '642af7416c984cbff216fcd3',
  };

  next();
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => {
  res.status(404).send({ message: 'По указаной ссылке страница не найдена' });
});

app.listen(PORT);
