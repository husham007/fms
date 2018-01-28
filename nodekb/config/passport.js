const LocalStretegy=require('passport-local').Strategy;
const User = require('../models/user');
const BUser = require('../models/basic_user');
const config = require('../config/database');
const bcrypt=require('bcryptjs');

module.exports=function(passport){
  //local Strategy
  passport.use('admin', new LocalStretegy(function(username, password, done){
    //match password
    let query ={username:username};
    User.findOne(query, function(err, user){
      if (err) throw err;
      if (!user){
        return done (null, false, {message: 'No user found'});
      }

      //match password
      bcrypt.compare(password, user.password, function(err, isMatch){
        if (err) throw err;
        if (isMatch){
          return done (null, user);
        }else{
          return done (null, false, {message: 'Wrong Password'});
        }
      });
    });
  }));

  passport.use('buser', new LocalStretegy(function(username, password, done){
    //match password
    let query ={username:username};
    BUser.findOne(query, function(err, user){
      if (err) throw err;
      if (!user){
        return done (null, false, {message: 'No basic user found'});
      }

      //match password
      bcrypt.compare(password, user.password, function(err, isMatch){
        if (err) throw err;
        if (isMatch){
          return done (null, user);
        }else{
          return done (null, false, {message: 'Wrong user Password'});
        }
      });
    });
  }));

  passport.serializeUser(function(user, done) {
  //console.log('admin serialized');
  //console.log(user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  //console.log(user);
  if (user.usertype==0)
  {
    //console.log(user.id);
      User.findById(user._id, function(err, user) {
      //console.log('admin dserialized');
      done(err, user);
    });
  }else if (user.usertype==1)
  {
      BUser.findById(user._id, function(err, buser) {
      //console.log('user deserialized');
      done(err, buser);
  });
}});
}
