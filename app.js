var express = require('express');
var path = require('path');
var ejs=require('ejs');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session=require('express-session');
var sequelize = require("sequelize");
var routes = require('./routes/index');
var users = require('./routes/users');
var home = require('./routes/home');
var product=require('./routes/product');
var model=require('./routes/model');
var directive=require('./routes/directive');
var callback = require('./routes/callback');
var admin = require('./routes/admin');
var test = require('./routes/test');
var push = require('./routes/push');
var credit = require('./routes/credit');
var RBAC = require('rbac');
var secure = require('rbac/controllers/express');
//var islogin = require('islogin');

var app = express();
var Q = require('q');
var BaseController = require('./controllers/_base_controller');
var accountLogic = require('./logic/account_logic');
var custonUtils = require('./lib/customUtils');
var config = require('./config/config');
// view engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs'); //替换文件扩展名ejs为html

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'robot server',
    resave: true,
    saveUninitialized: true
}));

app.use(function(req, res, next){
    console.log("app.usr local");
    res.locals.user = req.session.user;
    next();
});

app.use(function(req, res, next){
    //console.log(req.param);
    //custonUtils.logRequest(req);
    if(config.controller.check_token) {
        /**
         * 在这里加入登录验证逻辑
         */
        account_logic.isLogin(req).then(
            function (data) {
                next();
            },
            function (err) {
                res.json(err);
            }
        );
    }else{
        next();
    }
    //var url = req.originalUrl;
    //res.json(req.originalUrl);

    //next();
});

//后台检查路由表

app.use('/', routes);
app.use('/users', users);
app.use('/product',product);
app.use('/model',model);
app.use('/directive',directive);
app.use('/callback', callback);
app.use('/home', home);
app.use('/test', test);
app.use('/push', push);
app.use('/credit', credit);
//app.use(islogin({pattern:['/admin/login','/admin/layout','/admin/doLogin'],redirect:'/admin/login'},true));
//app.use('/admin', admin);
// angular启动页

app.set('view engine', 'html'); //替换文件扩展名html替换成ejs，后端报错用
app.use(express.static(path.join(__dirname, 'app')));
app.use('/admin', admin);

app.set('view engine', 'ejs'); //替换文件扩展名html替换成ejs，后端报错用
// catch 404 and forward to error handler
app.use(function(req, res, next) {
      var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
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
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
