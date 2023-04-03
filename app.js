const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
app.use('/users', require('./routes/users'));

app.listen(PORT);
