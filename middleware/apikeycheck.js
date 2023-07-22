const userProfiles = require('../model/userProfiles')
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { json } = require('body-parser');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));






const apiKeyMiddleware = (req, res, next) => {
  
  const apiKey = req.headers['x-api-key'];

  console.log(apiKey);
  // Replace 'YOUR_SECRET_API_KEY' with your actual API key
  const secretApiKey = '54321a';

  if (!apiKey || apiKey !== secretApiKey) {
    return res.status(405).json({ error: 'Invalid API key.' });
  }

  // If the API key is valid, proceed to the next middleware/route handler
  next();
};

module.exports = apiKeyMiddleware;