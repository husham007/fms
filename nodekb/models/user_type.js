const mongoose = require ('mongoose');

const userTypeSchema=mongoose.Schema({
  typetitle:{
    type:String,
    required:true
  },
    usertype:{
    type:Number,
    required:true
  }

});

const UserType=module.exports = mongoose.model('UserType', userTypeSchema);
