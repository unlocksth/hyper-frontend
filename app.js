var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session')({
  secret: 'it3mq1at3mark3tq1ac3',
  resave: false,
  saveUninitialized: true,
  cookie: { _expires: (10 * 60 * 1000) } //  10 minutes
});
var passport = require('passport');
var passportLocal = require("./routes/auth/passport-local");
var passportFacebook = require("./routes/auth/passport-facebook");

var app = express();
var routeModules = [];

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(expressSession);

app.use(function(req, res, next) {
  var msgs = req.session.messages || [];
  res.locals.messages = msgs;
  res.locals.hasMessages = !! msgs.length;
  req.session.messages = [];
  next();
});

app.use(passport.initialize());
app.use(passport.authenticate('session'));
passport.use(passportLocal);
passport.use(passportFacebook);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use(express.static(path.join(__dirname, 'public')));

fs.readdirSync(__dirname + '/routes/pages').forEach(function(name){
  var obj = require(path.join(__dirname, '/routes/pages/' + name));
  routeModules.push(obj);
});

// connect to routing files
app.use(routeModules);

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
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
