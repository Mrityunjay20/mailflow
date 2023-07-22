const body = require('body-parser');
const express = require('express');
const router = express.Router();
const path = require('path');
const postSignup = require('../controller/userAuth');
const jwt = require('jsonwebtoken');


const apiKeyMiddleware = require('../middleware/apikeycheck');

// const isValid = require('../middleware/apikeycheck');


// router.get('/',(req,res)=>{
//     res.send('home page');
// });

// router.get('/signin',(req,res)=>{
//     res.status(200).sendFile(path.join(__dirname,'..','views','signin.html'))
// })

router.get('/signup',(req,res)=>{
    res.status(200).sendFile(path.join(__dirname,'..','views','signup.html'))
})

router.get('/signin',(req,res)=>{
    res.status(200).sendFile(path.join(__dirname,'..','views','signin.html'))
})

router.post("/signup",apiKeyMiddleware,postSignup.postAddUser);

router.post('/signin',apiKeyMiddleware, postSignup.postUserLogin);

// router.get('/api_test',postSignup.post_apitest);

module.exports = router;


