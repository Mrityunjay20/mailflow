const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');

const authRouters = require('./routes/authRoute')
const profileRoutes = require('./routes/profile');

app.use(bodyParser.urlencoded({extended:true}));
app.use(authRouters);
app.use(profileRoutes);

const dbName = 'Trackpe';
const url = process.env.MONGO_URL;
mongoose.connect(url,{ dbName, useNewUrlParser: true, useUnifiedTopology: true }).then(result=>{
    app.listen(3000)
}).catch(err=>{
    console.log(err);
});


app.use((req,res,next)=>{
    res.status(404).sendFile(path.join(__dirname,'views','404.html'));
})
