var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');

// database settings
var mongoose = require("mongoose");
mongoose.Promise = require('q').Promise;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
mongoose.connect('mongodb://localhost/diy_travel');

// routes
var routes = require('./routes/index');
var users = require('./routes/users');
var package = require('./routes/package');
var dashboard = require('./routes/dashboard');
var uploads = require('./routes/uploads');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(compression());
app.use(bodyParser.json({limit: '5MB'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '5MB'}));
app.use(cookieParser());

app.enable('trust proxy');
// static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

// session
app.use(session({
  secret: 'diy travel server',
  cookie: {
    maxAge: 1000*60*60*24*7
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 14*24*60*60
  }),
  resave: false,
  saveUninitialized: true
}));

// passport
app.use(passport.initialize());
app.use(passport.session());
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());


// router
app.use('/', routes);
app.use('/users', users);
app.use('/packages', package);
app.use('/dashboard', dashboard);
app.use('/uploads', uploads);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  console.log(err);
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log(err);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log(err);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
