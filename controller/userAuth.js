const userProfiles = require('../model/userProfiles')

exports.postAddUser = async (req,res,next) =>{
    const fname = req.body.name;
    const fphone = req.body.phone;
    const femail = req.body.email;
    const fpassword = req.body.password;

    const newUser = new userProfiles({
        userName: fname,
        phone: fphone,
        email:femail,
        password:fpassword
    });
    const trial = await userProfiles.findOne({email:femail});
    
    if(trial !== null && trial.email !== null){
        console.log("user with this email already exists");
        res.status(409).redirect('/user_already_exists');
    }

    else{
        await newUser.save().then(result=>{
            console.log("user saved");
            res.redirect('/signin');
        }).catch(err=>{
            console.log(err);
        });
    }
    
}

exports.postUserLogin = (req,res,next)=>{
    res.setHeader('Set-Cookie',"loggedIn=true; HttpOnly");
    res.redirect('/dashboard');
}