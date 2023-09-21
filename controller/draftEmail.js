const body = require('body-parser');
const saveEmails = require('../model/EmailDrafts');
const userProfiles = require('../model/userProfiles')
const passport = require('passport');


exports.saveDraft = async (req,res,next)=>{
    async function saveDraft(user){
        console.log(user.email);
        const numDraft = await saveEmails.count({email:user.email});
        if(numDraft>5){
            res.status('416').send("you can only save upto 5 mails");
        }else{
            const finalDraft = new saveEmails({
                email: user.email,
                draftTitle: req.body.title,
                draftBody: req.body.draft,
                UserDetails: user._id
            });
            await finalDraft.save().then(result=>{
                console.log("draft saved");
                res.send("itworkd");
                 }).catch(err=>{
                console.log(err);
            });
        }};

    passport.authenticate('jwt',{session:false}, function(err, user, info, status) {
        if (err) { return next(err) }
        if (!user) { return res.status(401).redirect('/signin') }
        else if(user){saveDraft(user)}
      })(req, res, next);
}

exports.seemail = async(req,res,next)=>{
    async function seemail(user){
        const retriveEmail = await saveEmails.find({email:user.email});
        res.send(retriveEmail);
    }
    passport.authenticate('jwt',{session:false}, function(err, user, info, status) {
        if (err) { return next(err) }
        if (!user) { return res.status(401).send("user not found")}
        else if(user){seemail(user)}
    })(req, res, next);
}

