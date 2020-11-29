var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var passCatModel= require('../modules/password-category');
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
      if(err) throw err;
      res.render('password_category', { title: 'Password Managment System' ,loginUser:req.session.username, record:data });
    })
  });
  
  router.get('/edit/:id',checkLoginUser, function(req, res, next) {
    // var loginUser=localStorage.getItem('loginUser');
    var passCat_id = req.params.id;
    var getrecord=passCatModel.findById(passCat_id);
    getrecord.exec((err,data)=>{
      if(err) throw err;
      res.render('edit-pass-category', { title: 'Password Managment System' ,loginUser:req.session.username,msgg:'',msg:'', record:data ,id:passCat_id}); 
    })
  });
  
  router.post('/edit',checkLoginUser, function(req, res, next) {
    var passCat_id = req.body.id;
    var getpassCategory = req.body.pass;
    var updateCat=passCatModel.findByIdAndUpdate(passCat_id,{password_category:getpassCategory});
    updateCat.exec((err,doc)=>{
      if(err){throw err;} 
      else{res.redirect('/PasswordCategory');}
      })
  });
  
  router.get('/delete/:id',checkLoginUser, function(req, res, next) {
    var passCat_id = req.params.id;
    var delrecord=passCatModel.findByIdAndDelete(passCat_id);
    delrecord.exec((err)=>{
      if(err){ throw err;}
      else{res.redirect('/PasswordCategory');} 
    })
  });

  module.exports = router;