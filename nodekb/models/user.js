const mongoose = require ('mongoose');

//User Schema

const userSchema=mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  username:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  usertype:{
    type:Number,
    required:true
  }

});

const User=module.exports = mongoose.model('User', userSchema);
