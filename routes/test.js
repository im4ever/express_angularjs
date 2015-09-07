/**
 * Created by qufan on 2015/8/20.
 */

var express = require('express');
var router = express.Router();
var qiniu = require('./../lib/qiniu_client');
var TestController = require('./../controllers/test_controller');
var PushController = require('./../controllers/push_controller');
var jpush= require('./../lib/jpush_client');
var qiniuClient = require('./../lib/qiniu_client');
var util = require('util');
var userModel = require("./../models/user_model");

router.get("/model", function(req, res){
    var instance = this;
    userModel.update(
        {
            nickname:'dsadsa'
        },
        {
            where:{
                uid:{
                    $in:[1,2]
                }

            },
            individualHooks:true
        }
    ).then(
        function(data){
            console.log(data);
        },
        function(err){

        }
    )
});


router.get('/qiniu',function(req,res){
    var data ={'uptoken': qiniu.getUpToken()};
    res.json(data);
});

router.all('/chain', function(req, res){
    console.log('heh');
    var testController = new TestController(req, res);
    testController.signin();
});

router.all('/signin3rd', function(req, res){
    var testController = new TestController(req, res);
    testController.signin3rd();
});

router.all('/login', function(req, res){
    var testController = new TestController(req, res);
    testController.login();
});

router.get('/test/downloadUrlPrivate',function(req,res){
    var url=qiniu.downloadUrlPrivate('7xl1fl.com5.z0.glb.clouddn.com','o_19ta5pk1dem71frkkjh11pq3cq9.txt');
    res.json(url);
});
router.get('/push',function(req,res){
   jpush.advancedPush('1111');
});

router.get('/callback', function(req, res){
    var arr = {uid:1, pid:2};
    if(util.isArray(arr)){
        console.log('yes');
    }else{
        console.log('no');
    }
    var callbackbody = qiniuClient.makeCallbackBody(arr);
    console.log(callbackbody);
});

router.get("/frame", function(req, res){
    qiniuClient.getFrame("102/videos/11", "102/frames/11");
});
var pushLogic = require("./../logic/push_logic");
router.all("/message", function(req, res){
    pushLogic.makeJumpUrlMessage('hahah',"www.baidu.com");
    pushLogic.makeJumpCreateMessage("create",1);
    pushLogic.makeJumpModelInfoMessage("model", 1, 2);
    pushLogic.makeNormalMessage("dsadas",3);
});

var messageModel = require("./../models/message_model");
router.all("/getmsg", function(req, res){

    messageModel.findAll().then(
        function(data){
            res.json(data);
        }
    );
});




router.get("/push1/:content/:mid",function(req,res){
    var pushController= new PushController(req,res);
    pushController.modelInfoPushToSingle();
});

router.all("/push1",function(req,res){
    var pushController= new PushController(req,res);
    pushController.modelInfoPushToSingle();
});

router.get("/push2/:content",function(req, res){
    var pushController= new PushController(req,res);
    pushController.textPushToSingle();
});

router.all("/push2",function(req, res){
    var pushController= new PushController(req,res);
    pushController.textPushToSingle();
});

router.get("/push3/:content/:url",function(req,res){
    var pushController= new PushController(req,res);
    pushController.urlPushToSingle();
});

router.all("/push3",function(req,res){
    var pushController= new PushController(req,res);
    pushController.urlPushToSingle();
});

router.all("/push4/:content",function(req, res){
    var pushController= new PushController(req,res);
    pushController.createPushToSingle();
});

router.all("/push4",function(req, res){
    var pushController= new PushController(req,res);
    pushController.createPushToSingle();
});


//router.get("/push/:registrationID/:content/:mid",function(req,res){
//    var pushController=new PushController(req,res);
//    pushController.modelInfoPushToSingle();
//});
module.exports = router;