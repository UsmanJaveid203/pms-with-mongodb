var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var passCatModel= require('../modules/password-category');
var passModel= require('../modules/add_password');
var getPassCat = passCatModel.find({});
var session = require('express-session');

router.use(session({
  secret: '*5>KE>u~jF2?gP!*xH!M',
  resave: false,
  saveUninitialized: true,
}))


// to require node-localstorage package
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

function checkLoginUser(req,res,next){
  var userToken=localStorage.getItem('userToken');
  try {
    if(req.session.username){
      var decoded = jwt.verify(userToken, 'loginToken');
    }else{
      res.redirect('/');
    }
  } catch(err) {
    res.redirect('/');
  }
  next();
}

router.get('/logout', function(req, res, next) {
  //for seesion
  req.session.destroy(function(err) {
    if(err){
      res.redirect('/')
    }
  })
  // for local
  // localStorage.removeItem('userToken');
  // localStorage.removeItem('loginUser');
  res.redirect('/');
});

 
router.get('/',checkLoginUser, function(req, res, next) {
    // var loginUser=localStorage.getItem('loginUser');
    getPassCat.exec((err,data)=>{
      if(err){throw err;}
      else{
        res.render('addNewPassword', { title: 'Password Managment System' ,loginUser:req.session.username, record:data , success:'' });
      }
    })
  });
  
  router.post('/',checkLoginUser, function(req, res, next) {
    // var loginUser=localStorage.getItem('loginUser');
    var cat = req.body.pass_cat;
    var info= req.body.pass_details;
    var project=req.body.project_name;
    var information=new passModel({
      password_category:cat,
      password_detail:info,
      project_name:project
    })
    information.save((err,doc)=>{
      if(err){throw err;}
      else{
        getPassCat.exec((err,data)=>{
          if(err){throw err;}
          else{
            res.render('addNewPassword', { title: 'Password Managment System' ,loginUser:req.session.username, record:data , success:'record inserted successfully' });
          }
        })
      }
    })
  });

  module.exports = router;