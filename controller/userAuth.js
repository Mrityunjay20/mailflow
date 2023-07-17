const userProfiles = require('../model/userProfiles')
const body = require('body-parser');
const bcrypt = require('bcrypt');
const { json } = require('body-parser');
const saltRounds = 10;
const jwt = require('jsonwebtoken');


exports.postAddUser = async (req,res) =>{
    const hash = await bcrypt.hash(req.body.password,saltRounds);
    const newUser = new userProfiles({
        userName: req.body.name,
        phone: req.body.phone,
        email:req.body.email,
        password:hash
    });

    const trial = await userProfiles.findOne({email:req.body.email});
    if(trial !== null && trial.email !== null){
        res.status(409).send({
            success:false,
            message:"user with this email already exists"
        });
    }

    else{
        await newUser.save().then(result=>{
            res.status(200).send({
                success:true,
                message:"account created successfully"
            });
        }).catch(err=>{
            console.log(err);
        });
    }
    
};

exports.postUserLogin = async (req,res)=>{
    const Usremail = req.body.email;
    const Usrpassword = req.body.password;
    const lemail = await userProfiles.findOne({email: Usremail});
    const secretOrPrivateKey = process.env.JWT_KEY;
    if(lemail !== null ){
        const payload = {
            user_email: Usremail,
            id: lemail._id
        }
        bcrypt.compare(Usrpassword, lemail.password, (err,result)=>{
            if(result === true){

                //jwt token create
                const token = jwt.sign(payload, secretOrPrivateKey, {expiresIn: "1d"});         
                return res.status(200).cookie('jwtToken', token, {
                    httpOnly: true, // Cookie cannot be accessed by client-side JavaScript
                    secure: true, // Cookie can only be sent over HTTPS (requires SSL/TLS)
                    sameSite: 'strict', // Cookie is not sent in cross-site requests
                  });
                // return res.status(200).send({
                //     success:true,
                //     message:"logged in successfully",
                //     token:"Bearer "+ token
                // })
                
                
            }else{
                return res.status(401).send({
                    success:false,
                    message:"wrong password"
                });
            }
        });
    }else{
        return res.status(401).send({
            success:false,
            message:"no such email found "+ Usremail
        });
    }
}

