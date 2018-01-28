const express= require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const Bpassport = require('passport');
const config=require('../config/database');

let User=require('../models/user');
let BUser=require('../models/basic_user');
let UserType=require('../models/user_type');

//register form
router.get('/register', function(req,res){
  res.render('register');
});

//user register form
router.get('/user_register', function(req,res){
  res.render('user_register');
});


//Registration process
router.post('/register', function(req,res){
  const name=req.body.name;
  const email=req.body.email;
  const username=req.body.username;
  const password=req.body.password;
  const password2=req.body.password2;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not correct').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Confirm password is required').equals(req.body.password);


let errors = req.validationErrors();
if(errors){
  res.render('register', {
    errors:errors
  });
} else{
  var type = 0;
  let newUser=new User({
    name:name,
    email:email,
    username:username,
    usertype:type.valueOf(),
    password:password
  });

  bcrypt.genSalt(10, function(err,salt){
    bcrypt.hash(newUser.password, salt, function(err,hash){
      if(err){
        console.log(err);
      }
      newUser.password=hash;
      newUser.save(function(err){
        if (err){
          console.log(err);
          return;
        }else{
          req.flash('success', 'You are now registered and now can login');
          res.redirect('/users/login');
        }
      });
    });
  });
}
})

//basic user registration process
router.post('/user_register', function(req,res){
  const name=req.body.name;
  const email=req.body.email;
  const contact=req.body.contact;
  const username=req.body.username;
  const password=req.body.password;
  const password2=req.body.password2;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is required').isEmail();
  req.checkBody('code', 'Access code is Empty').notEmpty();
  req.checkBody('code', 'Access code is required').equals('VU-Test-Phase');
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('contact', 'Contact is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Confirm password is required').equals(req.body.password);


let errors = req.validationErrors();
if(errors){
  res.render('user_register', {
    errors:errors
  });
} else{
  var type = 1;
  let newUser=new BUser({
    name:name,
    email:email,
    contact:contact,
    usertype:type.valueOf(),
    username:username,
    password:password
  });

  bcrypt.genSalt(10, function(err,salt){
    bcrypt.hash(newUser.password, salt, function(err,hash){
      if(err){
        console.log(err);
      }
      newUser.password=hash;
      newUser.save(function(err){
        if (err){
          console.log(err);
          return;
        }else{
          req.flash('success', 'You are now registered and now can login');
          res.redirect('/users/user_login');
        }
      });
    });
  });
}
})

//login form
router.get('/login', function(req,res){

  res.render('login');
})

//login process
router.post('/login', function(req, res, next){

//require('../config/passport')(passport);


  //passport middleware

  passport.authenticate('admin', {
    successRedirect:'/articles/files',
    failureRedirect:'/users/login',
    failureFlash:true
  })(req,res,next);


});

//logout process
router.get('/logout', function(req, res){
  req.logout();

  req.flash('success', 'You are logged out');
  res.redirect('/users/login');
})

//login form
router.get('/user_login', function(req,res){

res.render('user_login');
})

//login process
router.post('/user_login', function(req, res, next){


  //passport middleware
  //require('../config/Bpassport')(passport);

  Bpassport.authenticate('buser', {
    successRedirect:'/articles/files',
    failureRedirect:'/users/user_login',
    failureFlash:true
  })(req,res,next);

});

//logout process
router.get('/user_logout', function(req, res){
  req.logout();

  req.flash('success', 'You are logged out');
  res.redirect('/users/user_login');

});


module.exports=router;
