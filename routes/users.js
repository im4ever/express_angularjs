var express = require('express');
var router = express.Router();
var AccountController = require('./../controllers/account_controller');
var PhotoController = require('./../controllers/photo_controller');
var PartController = require('./../controllers/part_controller');
//router.get('/', function(req, res, next) {
//    user.findAll().then(function(i){
//            res.json(i);
//        },
//        function(err) {
//            console.log(err);
//        }
//    );
//});

//router.all('/signin3rd', function(req, res, next){
//    var accountController = new AccountController(req, res);
//    accountController.signinFrom3rdFlow();
//});


/**
 * 用户登录
 */
router.get('/signin/:email/:password', function (req, res, next) {
    var accountController = new AccountController(req, res);
    accountController.signin();
});

router.all('/signin', function (req, res, next) {
    var accountController = new AccountController(req, res);
    accountController.signin();
});

/**
 * 用户登录
 */

router.all('/signin3rd', function (req, res, next) {
    var accountController = new AccountController(req, res);
    accountController.signin3rd();
});

/**
 * 用户注册
 */
router.get('/signup/:email/:password', function (req, res, next) {
    var accountController = new AccountController(req, res);
    accountController.signup();
});

router.all('/signup', function (req, res, next) {
    var accountController = new AccountController(req, res);
    accountController.signup();
});

/**
 * 用户登出接口
 */
router.all('/signout', function (req, res, next) {
    var accountController = new AccountController(req, res);
    accountController.signout();
});

/**
 * token刷新
 */
router.get('/token/:uid/:token', function (req, res, next) {
    var accountController = new AccountController(req, res);
    accountController.refreshToken();
});

router.all('/token', function (req, res, next) {
    var accountController = new AccountController(req, res);
    accountController.refreshToken();
});

/**
 * 用户设置头像
 */
router.get('/avatar/:uid/:token/:imageType', function (req, res, next) {
    var photoController = new PhotoController(req, res);
    photoController.upload();
});

router.all('/avatar', function (req, res, next) {
    var photoController = new PhotoController(req, res);
    photoController.upload();
});

/**
 * 用户信息修改
 */
router.all('/info/:pid/:nickname', function(req, res, next){
    var accountController = new AccountController(req, res);
    accountController.info();
});

router.all('/info', function(req, res){
    var accountController = new AccountController(req, res);
    accountController.info();
});

/**
 * 用户忘记密码
 */
router.get('/forgotten/:email', function (req, res, next) {
    var accountController = new AccountController(req, res);
    accountController.forgotten();
});

router.all('/forgotten', function (req, res, next) {
    var accountController = new AccountController(req, res);
    accountController.forgotten();
});

/**
 * 重置密码页面生成
 */
router.get('/reset/:uid/:resetToken', function (req, res, next) {
    var accountController = new AccountController(req, res);
    accountController.reset();
});

router.all('/reset', function(req, res, next){
    var accountController = new AccountController(req, res);
    accountController.reset();
});

/**
 * 重置密码的操作
 */
router.all('/pwd', function(req, res,  next){
    var accountController = new AccountController(req, res);
    accountController.pwd();
});

/**
 * 获得我的零件列表
 */
router.get('/parts',function(req,res){
    var partController=new PartController(req,res);
    partController.getMyParts();
});

/**
 * 编辑 我的零件列表
 */
router.get('/partsEdit/:parts',function(req,res){
    var partController=new PartController(req,res);
    partController.edit();
});

router.all('/partsEdit',function(req,res){
    var partController=new PartController(req,res);
    partController.edit();
});


router.get('/test',function(req,res){
    var accountController = new AccountController(req,res);
    accountController.test();
});

router.get('/uploadtoken', function(req, res){

});

module.exports = router;
