const express = require ('express');
const router = require('./authRoute');
const Router= express.Router();
const path = require('path');
const isAuth = require('../middleware/is-auth');
const makeEmail = require('../controller/generateEmail');
const draftEmail = require('../controller/draftEmail');
const { route } = require('./authRoute');


router.get('/dashboard',isAuth,(req,res)=>{
    res.status(200).sendFile(path.join(__dirname,'..','views','dashboard.html'))
})

router.post('/resemail', makeEmail.makeemail);
router.get('/finetest',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','savedraft.html'));
});
router.post('/finetest', draftEmail.idDets);
router.get('/saved',draftEmail.seemail);
module.exports = Router;
