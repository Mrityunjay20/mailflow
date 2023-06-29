const express = require('express');
const router = express.Router();
const path = require('path');
const postSignup = require('../controller/userAuth');
router.get('/',(req,res)=>{
    res.send("router works");
});

router.get('/signin',(req,res)=>{
    res.status(200).sendFile(path.join(__dirname,'..','views','signin.html'))
    console.log(req.get('Cookie'));
})

router.get('/signup',(req,res)=>{
    res.status(200).sendFile(path.join(__dirname,'..','views','signup.html'))
})

router.post("/signup", postSignup.postAddUser);

router.post('/signin', postSignup.postUserLogin);

module.exports = router;


