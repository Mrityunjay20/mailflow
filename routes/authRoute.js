const express = require('express');
const router = express.Router();
const path = require('path');
const postSignup = require('../controller/userSignup');
router.get('/',(req,res)=>{
    res.send("router works");
});

router.get('/signin',(req,res)=>{
    res.status(200).sendFile(path.join(__dirname,'..','views','signin.html'))
})

router.get('/signup',(req,res)=>{
    res.status(200).sendFile(path.join(__dirname,'..','views','signup.html'))
})

router.post("/signup", postSignup.postAddUser);


module.exports = router;


