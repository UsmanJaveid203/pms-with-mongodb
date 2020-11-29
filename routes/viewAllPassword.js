var express = require('express');
var router = express.Router();
var userModule= require('../modules/user');
var jwt = require('jsonwebtoken');
var passCatModel= require('../modules/password-category');
var passModel= require('../modules/add_password');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
var getPassCat = passCatModel.find({});
var getAllPass = passModel.find({});
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
  var perPage = 8;
  var page = req.params.page || 1;
  getAllPass.skip((perPage * page) - perPage)
  .limit(perPage).exec((err,data)=>{
    if(err){throw err;}
    else{
      passModel.countDocuments({}).exec((err,count)=>{ 
      res.render('viewAllPassword', { title: 'Password Managment System' ,loginUser:req.session.username, records:data,current:page, pages:Math.ceil(count/perPage) });
      });
    }
  })
});

router.get('/:page',checkLoginUser, function(req, res, next) {
  // var loginUser=localStorage.getItem('loginUser');
  var perPage = 8;
  var page = req.params.page || 1;
  getAllPass.skip((perPage * page) - perPage)
  .limit(perPage).exec((err,data)=>{
    if(err){throw err;}
    else{
      passModel.countDocuments({}).exec((err,count)=>{ 
      res.render('viewAllPassword', { title: 'Password Managment System' ,loginUser:req.session.username, records:data,current:page, pages:Math.ceil(count/perPage) });
      });
    }
  })
});

router.get('/edit/:id',checkLoginUser, function(req, res, next) {
  // var loginUser=localStorage.getItem('loginUser');
  var pass_id = req.params.id;
  var updaterec=passModel.findById(pass_id);
  updaterec.exec((err,dataa)=>{
    if(err){throw err;}
    else{
      getPassCat.exec((err,data)=>{
        if(err){throw err;}
        else{
          res.render('edit_pass_detail', { title: 'Password Managment System' ,loginUser:req.session.username, records:dataa, record:data, id:pass_id });
        }
      })
    } 
  })
});

router.post('/edit/',checkLoginUser, function(req, res, next) {
  var getpass_id = req.body.id;
  var getcatname= req.body.pass_cat;
  var getproname=req.body.project_name;
  var getdetail= req.body.pass_details;
  var updaterecord=passModel.findByIdAndUpdate(getpass_id,{password_category:getcatname,
    password_detail:getdetail,
    project_name:getproname });
    updaterecord.exec((err,data)=>{
    if(err){throw err;}
    else{res.redirect('/view-all-password')}
  })
});


router.get('/delete/:id',checkLoginUser, function(req, res, next) {
  var pass_id = req.params.id;
  var delrec=passModel.findByIdAndDelete(pass_id);
  delrec.exec((err)=>{
    if(err){ throw err;}
    else{res.redirect('/view-all-password');} 
  })
});
 

  module.exports = router;