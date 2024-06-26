const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');
const passport = require('passport');
const authRoutes = require('./routes/authRoute');
const profileRoutes = require('./routes/profile');
const cors = require('cors');

// Allow all origins
app.use(cors());

app.use(express.json());
app.set('trust-proxy', true);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(authRoutes);
app.use(profileRoutes);

app.use(passport.initialize());
require('./middleware/passport');

const dbName = 'MailFlow';
const url = process.env.MONGO_URL;
mongoose
  .connect(url, { dbName, useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    app.listen(4000);
  })
  .catch((err) => {
    console.log(err);
  });

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
  
});
