var createError = require('http-errors');
var express = require('express');
// var bodyParser = require('body-parser')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var dashboardRouter = require('./routes/dashboard');
var addNewCategoryRouter=require('./routes/addNewCategory');
var password_categoryRouter= require('./routes/password_category');
var addNewPasswordRouter=require('./routes/addNewPassword');
var viewAllPasswordRouter=require('./routes/viewAllPassword');
var usersRouter = require('./routes/users');

var PassCatApi= require('./api/add-category');
var ProCatApi= require('./api/product');
var userCatApi= require('./api/user');
var app = express();

// // parse various different custom JSON types as JSON
// app.use(bodyParser.json({ type: 'application/*+json' }))

// // parse some custom thing into a Buffer
// app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/dashboard',dashboardRouter);
app.use('/addNewCategory',addNewCategoryRouter);
app.use('/PasswordCategory',password_categoryRouter);
app.use('/Add-New-Password',addNewPasswordRouter);
app.use('/view-all-password',viewAllPasswordRouter);
app.use('/users', usersRouter);

app.use('/api/',PassCatApi);
app.use('/productApi/',ProCatApi);
app.use('/userApi/',userCatApi);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status).json({
      "error":"Page Not Found"
  });
  res.status(500).json({
    "error":"Internal server error"
});
  res.render('error');
});

module.exports = app;
