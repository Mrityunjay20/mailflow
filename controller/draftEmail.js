const body = require('body-parser');
const saveEmails = require('../model/EmailDrafts');
const userProfiles = require('../model/userProfiles')


exports.idDets = async (req,res)=>{
    const findId = await userProfiles.findOne({email:"mjxworks@gmail.com"});
    

    const femail = req.body.emailContent;
    const finalDraft = new saveEmails({
        email: "mjxworks@gmail.com",
        draftBody: femail,
        UserDetails: femail._id
    }
    );
    await finalDraft.save().then(result=>{
        console.log("draft saved");
        res.send("itworkd");
    }).catch(err=>{
        console.log(err);
    });
}

exports.seemail = async(req,res)=>{
    const draft = await saveEmails.find({email:"mjxworks@gmail.com"});
    const totaldrafts = await saveEmails.count ([
        { $match: { email:"mjxworks@gmail.com"} }
      ]);
      
    res.send(draft);
    console.log(totaldrafts);
}