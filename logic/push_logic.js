var jpush= require('./../lib/jpush_client'),
    Q = require('q'),
    customUtil = require('./../lib/customUtils'),
    messageModel = require('./../models/message_model'),
    customConst = require('./../lib/const'),
    util = require("util");
var singlePush=function(pushID,content,extra){
    var deferred = Q.defer();
    jpush.singlePush(pushID,content,extra).then(function(data){
        deferred.resolve(data);
    },function(err){
        deferred.reject(err);
    });
    return deferred.promise;
};
exports.singlePush=singlePush;
var allPush=function(content,extra){
    var deferred = Q.defer();
    jpush.advancedPush(content,extra).then(function(data){
        deferred.resolve(data);
    },function(err){
        deferred.reject(err);
    });
    return deferred.promise;
};
exports.allPush=allPush;
/**
 * 锟斤拷转url锟斤拷锟斤拷息
 * @param content
 * @param url
 * @param type 锟斤拷锟斤拷锟斤拷息锟斤拷锟酵ｏ拷锟斤拷锟斤拷锟斤拷示锟斤拷同锟斤拷图锟斤拷
 * @returns {deferred.promise|{then, catch, finally}}
 */
var makeJumpUrlMessage = function(content,url, type ){
    var deferred = Q.defer();
    var message = {content:content, type:type, ctime:customUtil.now(),code:customConst.JUMP_URL , params:JSON.stringify({url:url})};
    messageModel.create(message).then(
        function(data){
            if(util.isNullOrUndefined(data)){
                deferred.reject(customUtils.makeError(customConst.ERR_DB, 'message create failed!'));
            }else{
                deferred.resolve(data);
            }
        },
        function(){
            deferred.reject(customUtils.makeError(customConst.ERR_DB, 'message create failed!'));
        }
    );
    return deferred.promise;
};

exports.makeJumpUrlMessage = makeJumpUrlMessage;

/**
 * 锟斤拷转锟斤拷模锟斤拷锟斤拷锟斤拷锟斤拷锟较�
 * @param content
 * @param mid
 * @param type
 * @returns {deferred.promise|{then, catch, finally}}
 */
var makeJumpModelInfoMessage = function(content, mid, type){
    var deferred = Q.defer();
    var message = {content:content,type:type, ctime:customUtil.now(),code:customConst.JUMP_MODE_INFO, params:JSON.stringify({mid:mid})};
    messageModel.create(message).then(
        function(data){
            if(util.isNullOrUndefined(data)){
                deferred.reject(customUtils.makeError(customConst.ERR_DB, 'message create failed!'));
            }else{
                deferred.resolve(data);
            }
        },
        function(){
            deferred.reject(customUtils.makeError(customConst.ERR_DB, 'message create failed!'));
        }
    );
    return deferred.promise;
};

exports.makeJumpModelInfoMessage = makeJumpModelInfoMessage;

/**
 * 锟斤拷转锟斤拷锟斤拷锟斤拷页锟斤拷锟斤拷锟较�
 * @param content
 * @param type
 * @returns {deferred.promise|{then, catch, finally}}
 */
var makeJumpCreateMessage = function(content, type){
    var deferred = Q.defer();
    var message = {content:content,type:type, ctime:customUtil.now(),code:customConst.JUMP_CREATE};
    messageModel.create(message).then(
        function(data){
            if(util.isNullOrUndefined(data)){
                deferred.reject(customUtils.makeError(customConst.ERR_DB, 'message create failed!'));
            }else{
                deferred.resolve(data);
            }
        },
        function(){
            deferred.reject(customUtils.makeError(customConst.ERR_DB, 'message create failed!'));
        }
    );
    return deferred.promise;
};

exports.makeJumpCreateMessage = makeJumpCreateMessage;

/**
 * 锟斤拷通锟斤拷锟斤拷转锟斤拷息
 * @param content
 * @param type
 * @returns {deferred.promise|{then, catch, finally}}
 */
var makeNormalMessage = function(content, type){
    var deferred = Q.defer();
    var message = {content:content, type:type, ctime:customUtil.now(),code:customConst.JUMP_NONE};
    messageModel.create(message).then(
        function(data){
            if(util.isNullOrUndefined(data)){
                deferred.reject(customUtils.makeError(customConst.ERR_DB, 'message create failed!'));
            }else{
                deferred.resolve(data);
            }
        },
        function(){
            deferred.reject(customUtils.makeError(customConst.ERR_DB, 'message create failed!'));
        }
    );
    return deferred.promise;
};

exports.makeNormalMessage = makeNormalMessage;
//妯″瀷璺宠浆
exports.modelInfoPushToSingle=function(pushID,content,mid,type){
    var deferred = Q.defer();
    makeJumpModelInfoMessage(content,mid,type).then(function(data){
        return  singlePush(pushID,content,data).then();
    }).then(function(data){
        deferred.resolve(data);
    },function(err){
        deferred.reject(err);
    });
    return deferred.promise;
};

exports.modelInfoPushToAll=function(content,mid,type){
    var deferred = Q.defer();
    makeJumpModelInfoMessage(content,mid,type).then(function(data){
        return  allPush(content,data).then();
    }).then(function(data){
        deferred.resolve(data);
    },function(err){
        deferred.reject(err);
    });
    return deferred.promise;
};

//url璺宠浆
exports.urlPushToSingle=function(pushID,content,url,type){
    var deferred = Q.defer();
    makeJumpUrlMessage(content,url,type).then(function(data){
        return  singlePush(pushID,content,data).then();
    }).then(function(data){
        deferred.resolve(data);
    },function(err){
        deferred.reject(err);
    });
    return deferred.promise;

};
exports.urlPushToAll=function(content,url,type){
    var deferred = Q.defer();
    makeJumpUrlMessage(content,url,type).then(function(data){
        return  allPush(content,data).then();
    }).then(function(data){
        deferred.resolve(data);
    },function(err){
        deferred.reject(err);
    });
    return deferred.promise;
};

//鏂囨湰s
exports.textPushToSingle=function(pushID,content,type){
    var deferred = Q.defer();
    makeNormalMessage(content,type).then(function(data){
        return  singlePush(pushID,content,data).then();
    },function(err){
        deferred.reject(err);
    }).then(function(data){

        console.log(data);
        deferred.resolve(data);
    },function(err){
        console.log(err);
        deferred.reject(err);
    });
    return deferred.promise;
};
exports.textPushToAll=function(content,type){
    var deferred = Q.defer();
    makeNormalMessage(content,type).then(function(data){
        return  allPush(content,data).then();
    }).then(function(data){
        deferred.resolve(data);
    },function(err){
        deferred.reject(err);
    });
    return deferred.promise;
};
//鍒涘缓璺宠浆
exports.createPushToSingle=function(pushID,content,type){
    var deferred = Q.defer();
    makeJumpCreateMessage(content,type).then(function(data){
        return  singlePush(pushID,content,data).then();
    }).then(function(data){
        deferred.resolve(data);
    },function(err){
        deferred.reject(err);
    });
    return deferred.promise;
};
exports.createPushToAll=function(content,type){
    var deferred = Q.defer();
    makeJumpCreateMessage(content,type).then(function(data){
        return  allePush(content,data).then();
    }).then(function(data){
        deferred.resolve(data);
    },function(err){
        deferred.reject(err);
    });
    return deferred.promise;
};

