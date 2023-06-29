const express = require ('express');
const router = require('./authRoute');
const Router= express.Router();
const path = require('path');
const isAuth = require('../middleware/is-auth');


router.get('/dashboard',isAuth,(req,res)=>{
    res.status(200).sendFile(path.join(__dirname,'..','views','dashboard.html'))
})



module.exports = Router;
