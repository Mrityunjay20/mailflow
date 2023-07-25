const { default: mongoose } = require("mongoose");

const {Schema} =require("mongoose");;

const DraftSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    draftTitle:{
        type:String,
        required:true
    },
    draftBody:{
        type:String,
        required:true
    },
    UserDetails:{type: mongoose.Schema.Types.ObjectId, ref: 'User'}
})

module.exports = mongoose.model("Drafts", DraftSchema);