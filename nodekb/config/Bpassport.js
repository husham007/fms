const LocalStretegy=require('passport-local').Strategy;
const BUser = require('../models/basic_user');
const config = require('../config/database');
const bcrypt=require('bcryptjs');

module.exports=function(Bpassport){
  //local Strategy
  Bpassport.use('buser', new LocalStretegy(function(username, password, done){
    //match password
    let query ={username:username};
    BUser.findOne(query, function(err, buser){
      if (err) throw err;
      if (!buser){
        return done (null, false, {message: 'No basic user found'});
      }

      //match password
      bcrypt.compare(password, buser.password, function(err, isMatch){
        if (err) throw err;
        if (isMatch){
          return done (null, buser);
        }else{
          return done (null, false, {message: 'Wrong user Password'});
        }
      });
    });
  }));
  Bpassport.serializeUser(function(buser, done) {
    console.log('user serialized');
    done(null, buser.id);
});

Bpassport.deserializeUser(function(id, done) {
  BUser.findById(id, function(err, buser) {
    console.log('user deserialized');
    done(err, buser);
  });
});
}
