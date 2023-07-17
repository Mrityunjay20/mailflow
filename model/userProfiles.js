const { default: mongoose } = require("mongoose");

const {Schema} = mongoose;

const userSchema = new Schema({
    userName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    numDrafts:{
        type:Number,
        default:0
    },
    readEmailPermission:{
        type:Boolean,
        default:false
    },
    hasPaid:{
        type:Boolean,
        default:false
    },
    isBlocked:{
        type:Boolean,
        default:false
    }

})

module.exports = mongoose.model("Users",userSchema);