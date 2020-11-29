var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var passCatModel= require('../modules/password-category');
const { body, validationResult } = require('express-validator');
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
    res.render('addNewCategory', { title: 'Password Managment System',loginUser:req.session.username , msgg:'',msg:'' });
  });
  
  router.post('/',body('pass','category name should be greater then one character/digit').isLength({ min: 1 }),checkLoginUser, function(req, res, next) {
    // var loginUser=localStorage.getItem('loginUser');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('addNewCategory', { title: 'Password Managment System',loginUser:req.session.username , msgg:'' , msg:errors.mapped()});
    }else{
    let pass= req.body.pass;
    var passcatDetails = new passCatModel({
      password_category:pass
    })
    passcatDetails.save((err,doc)=>{
      if(err)throw err;
      res.render('addNewCategory', { title: 'Password Managment System',loginUser:req.session.username , msgg:'inerted successfully',msg:'' });
    });
   } 
  });

  module.exports = router;