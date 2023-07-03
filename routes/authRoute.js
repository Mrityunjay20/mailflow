const body = require('body-parser');
const express = require('express');
const router = express.Router();
const path = require('path');
const postSignup = require('../controller/userAuth');
const jwt = require('jsonwebtoken');

// const isValid = require('../middleware/apikeycheck');


router.get('/',(req,res)=>{
    res.send('home page');
});

router.get('/signin',(req,res)=>{
    res.status(200).sendFile(path.join(__dirname,'..','views','signin.html'))
})

router.get('/signup',(req,res)=>{
    res.status(200).sendFile(path.join(__dirname,'..','views','signup.html'))
})

router.post("/signup", postSignup.postAddUser);

router.post('/signin', postSignup.postUserLogin);

// router.get('/api_test',postSignup.post_apitest);

module.exports = router;


