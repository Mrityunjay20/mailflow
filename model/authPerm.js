const { default: mongoose } = require("mongoose");

const {Schema} =require("mongoose");

const authSchema = new mongoose.Schema({
    // Define the fields of the auth object
    // Example: You might have fields like keyfilePath, scopes, etc.
    email: String,
    authDets:mongoose.Schema.Types.Mixed
  });
  
const AuthModel = mongoose.model('gmailAuth', authSchema);
  
module.exports = AuthModel;