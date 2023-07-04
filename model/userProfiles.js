const { default: mongoose } = require("mongoose");

const {Schema} = mongoose;

const userSchema = new Schema({
    userName:{
        type:String,
        required:true
    },
    phone:{
        type:Number
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
})

module.exports = mongoose.model("Users",userSchema);