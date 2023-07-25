const express = require ('express');
const router= express.Router();
const path = require('path');
const makeEmail = require('../controller/generateEmail');
const draftEmail = require('../controller/draftEmail');
const { route } = require('./authRoute');
const passport = require('passport');

const apiKeyMiddleware = require('../middleware/apikeycheck');


router.post('/dashboard', function(req, res, next) {
    passport.authenticate('jwt',{session:false}, function(err, user, info, status) {
      console.log(user);
      if (err) { return next(err) }
      if (!user) { return res.status(401).redirect('/signin') }
      else if(user){res.status(200)}
    })(req, res, next);
  });

router.post('/genemail', apiKeyMiddleware,makeEmail.makeemail);
router.get('/finetest',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','savedraft.html'));
});
router.post('/saveDraft',apiKeyMiddleware, draftEmail.idDets);
router.get('/saved',apiKeyMiddleware,draftEmail.seemail);


module.exports = router;
