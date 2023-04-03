const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log("Connected with DB");
  })
  .catch((error) => {
    console.log(`Error during connection with DB ${error}`);
  });

  app.use((req, res, next) => {
  req.user = {
    _id: '642af7416c984cbff216fcd3'
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.listen(PORT);
