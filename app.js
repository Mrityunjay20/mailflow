const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');
const CookieSession = require('cookie-session');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const authRouters = require('./routes/authRoute')
const profileRoutes = require('./routes/profile');
const cookieSession = require('cookie-session');

app.set('trust-proxy',true);
app.use(bodyParser.urlencoded({extended:true}));
app.use(authRouters);
app.use(profileRoutes);
app.use(express.json());


app.use(passport.initialize());
require('./middleware/passport')

const dbName = 'MailFlow';
const url = process.env.MONGO_URL;
mongoose.connect(url,{ dbName, useNewUrlParser: true, useUnifiedTopology: true }).then(result=>{
    app.listen(3000)
}).catch(err=>{
    console.log(err);
});

app.get('/tries',passport.authenticate('jwt',{session:false}), (req,res)=>{
    res.send("success");
});


app.use((req,res,next)=>{
    res.status(404).sendFile(path.join(__dirname,'views','404.html'));
})
