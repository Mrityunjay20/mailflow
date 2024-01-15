const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');
const passport = require('passport');
const authRouters = require('./routes/authRoute');
const profileRoutes = require('./routes/profile');
const cors = require('cors');

// Combine CORS and JSON parsing middleware
app.use(cors());
app.use(express.json());

// CORS headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://mailflowai-ten.vercel.app/');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Other middleware
app.set('trust-proxy', true);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
require('./middleware/passport');

// Routes
app.use(authRouters);
app.use(profileRoutes);

// MongoDB connection
const dbName = 'MailFlow';
const url = process.env.MONGO_URL;
mongoose.connect(url, { dbName, useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        app.listen(4000, () => {
            console.log('Server is running on port 4000');
        });
    })
    .catch(err => {
        console.log(err);
    });

// 404 handler
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});
