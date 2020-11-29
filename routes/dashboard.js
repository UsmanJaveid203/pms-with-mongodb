var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var session = require('express-session');

router.use(session({
  secret: '*5>KE>u~jF2?gP!*xH!M',
  resave: false,
  saveUninitialized: true,
}));

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
    res.render('dashboard', { title: 'Password Managment System',loginUser:req.session.username ,msg:"" });
  });


module.exports = router;