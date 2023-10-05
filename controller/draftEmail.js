const body = require('body-parser');
const saveEmails = require('../model/EmailDrafts');
const userProfiles = require('../model/userProfiles')
const passport = require('passport');
const { ObjectId } = require('mongodb');


exports.saveDraft = async (req,res,next)=>{
    console.log('save draft called');
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

exports.deleteDraft = async(req,res,next)=>{
    async function deleteDraft(user){
        res.send(await saveEmails.deleteOne({_id:req.body.id}).then(result=>{
            res.status(202).send('email deleted')
        }).catch(err=>{
            res.status(404).send('no such object exists');
        }));
    }

    passport.authenticate('jwt',{session:false}, function(err, user, info, status) {
        if (err) { return next(err) }
        if (!user) { return res.status(401).send("user not found")}
        else if(user){deleteDraft(user)}
    })(req, res, next);
}

exports.updateDraft = async(req,res,next)=>{
    let draftId = req.body.id;
    let draftUpdate = {draftBody: req.body.update};
    let filter = {_id: draftId};

    async function updateDraft(user){
        const doc = await saveEmails.updateOne(filter, draftUpdate);
    }


    passport.authenticate('jwt',{session:false}, function(err, user, info, status) {
        if (err) { return next(err) }
        if (!user) { return res.status(401).send("user not found")}
        else if(user){updateDraft(user)}
    })(req, res, next);
}

