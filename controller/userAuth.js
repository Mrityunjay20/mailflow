const userProfiles = require('../model/userProfiles')
const body = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;


exports.postAddUser = async (req,res) =>{
    const hash = await bcrypt.hash(req.body.password,saltRounds);
    console.log(hash);

    const newUser = new userProfiles({
        userName: req.body.name,
        phone: req.body.phone,
        email:req.body.email,
        password:hash
    });

    const trial = await userProfiles.findOne({email:req.body.email});
    
    if(trial !== null && trial.email !== null){
        console.log("user with this email already exists");
        res.status(409).redirect('/user_already_exists');
    }

    else{

        await newUser.save().then(result=>{
            console.log("user saved");
            res.redirect('/dashboard');
        }).catch(err=>{
            console.log(err);
        });
    }
    
};

exports.postUserLogin = async (req,res)=>{
    const Usremail = req.body.email;
    const Usrpassword = req.body.password;

    const lemail = await userProfiles.findOne({email: Usremail});
    if(lemail !== null ){
        const lpassword = lemail.password;
        bcrypt.compare(Usrpassword, lemail.password, (err,result)=>{
            if(result === true){
                res.redirect('/dashboard');
            }else{
                res.redirect('/wrongPassword');
                }
        });
    }else{
        console.log("wrong email");
        res.redirect('/signin');
    }
}



// exports.post_apitest=(req,res,next)=>{
//     const resdata = 'api:works';
//   console.log(req.body.workapi);

//   res.json(resdata);
// }