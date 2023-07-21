const express = require ('express');
const router = require('./authRoute');
const Router= express.Router();
const path = require('path');
const makeEmail = require('../controller/generateEmail');
const draftEmail = require('../controller/draftEmail');
const { route } = require('./authRoute');
const passport = require('passport');

// router.get('/dashboard',(req,res)=>{
//     res.status(200).sendFile(path.join(__dirname,'..','views','dashboard.html'))
// })

router.post('/dashboard', function(req, res, next) {
    passport.authenticate('jwt',{session:false}, function(err, user, info, status) {
      if (err) { return next(err) }
      if (!user) { return res.status(401).redirect('/signin') }
      else if(user){res.status(200).sendFile(path.join(__dirname,'..','views','dashboard.html'))}
    })(req, res, next);
  });


router.post('/resemail', makeEmail.makeemail);
router.get('/finetest',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','savedraft.html'));
});
router.post('/saveDraft', draftEmail.idDets);
router.get('/saved',draftEmail.seemail);


module.exports = Router;
