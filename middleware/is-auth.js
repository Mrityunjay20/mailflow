module.exports=(req,res,next)=>{
    // if(!req.session.isLoggedIn){
    //     return res.redirect('/signin');
    // }
    console.log("auth-middleware used");
    next();
}