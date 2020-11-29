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

//  ***********************************************index Page Code start ******************************************************
router.get('/', function(req, res, next) {
  // var loginUser=localStorage.getItem('loginUser');
  if(req.session.username){
    res.redirect('/dashboard');
  }else{
    res.render('index', { title: 'Password Managment System' ,msg:"" });
  }
});

router.post('/', function(req, res, next) {
  // get value from index page.
  var username=req.body.uname;
  var password=req.body.password;
  var checkUser=userModule.findOne({username:username});
  checkUser.exec((err,data)=>{
    if(err) throw err;
    var getUserID=data._id;
    var getpassword=data.password;
    if(bcrypt.compareSync(password,getpassword)){
      // mathod to make token
      // in this loginToken is the name of token
      var token = jwt.sign({ userID: getUserID }, 'loginToken');
      localStorage.setItem('userToken', token);
      localStorage.setItem('loginUser', username);
      req.session.username=username;
      res.redirect('/dashboard');
    }else{
      res.render('index', { title: 'Password Managment System', msg:"Invalid Username and password ..." });
    }
  }); 
});
//  ***********************************************index Page Code end ******************************************************

//  ***********************************************Sign Up Page Code start ******************************************************
router.get('/signup', function(req, res, next) {
  if(req.session.username){
    res.redirect('/dashboard');
  }else{
  res.render('signup', { title: 'Password Managment System' , msg:"" });
  }
});

/* check username from the database that it already exist or not if yes
  then run if condition if not then continue it..*/
function checkUsername(req,res,next){
  var username=req.body.uname;
  var checkexitusername=userModule.findOne({username:username});
  checkexitusername.exec((err,data)=>{
    if(err) throw err;
    if(data){
      return res.render('signup', { title: 'Password Management System', msg:'Username already exits try another Username...' });
    }
    else{
      next();
    }
  })
}

/* check email from the database that it already exist or not if yes
  then run if condition if not then continue it..*/
function checkEmail(req,res,next){
  var emails=req.body.email;
  var checkexitemail=userModule.findOne({emails:emails});
  checkexitemail.exec((err,data)=>{
    if(err) throw err;            
    if(data){
      return res.render('signup', { title: 'Password Management System', msg:'Email already exits try another gmail...' });
    }
    else{
      next();
    }
  })
}

router.post('/signup',checkEmail,checkUsername,function(req, res, next) {
  var username=req.body.uname;
  var emails=req.body.email;
  var password=req.body.password;
  var confpassword=req.body.confpassword;
  if(password != confpassword){
    res.render('signup', { title: 'Password Management System', msg:'Password Did not match. Enter same password ' });
  }else{
    password= bcrypt.hashSync(req.body.password,10);
  var userDetails=new userModule({
    username:username,
    emails:emails,
    password:password
  });
    userDetails.save((err,doc)=>{
        if(err) throw err;
        res.render('signup', { title: 'Password Management System', msg:'User Registerd Successfully' });
     });
  }
});



router.get('/joinResult',checkLoginUser, function(req, res, next) {

passModel.aggregate([
  {
    $lookup:
      {
        from: "password_categories",
        localField: "password_category",
        foreignField: "passord_category",
        as: "pass_cat_details"
      }
 },
 { $unwind : "$pass_cat_details" }
]).exec(function(err,results){
   if(err) throw err;
   console.log(results);
   res.send(results);

});
});
module.exports = router;
