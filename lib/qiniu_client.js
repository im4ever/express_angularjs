/**
 * Created by XPS 12 on 2015/8/19.
 */
var qiniu = require('qiniu');
var qiniu_config = require('./../config/qiniu_config');
var Q = require('q');
var util = require('util');

qiniu.conf.ACCESS_KEY = qiniu_config.accessKey;
qiniu.conf.SECRET_KEY = qiniu_config.secretKey;

var client = new qiniu.rs.Client();
var bucketname = qiniu_config.bucket;

var getUpToken = function () {
    var putPolicy = new qiniu.rs.PutPolicy(bucketname, null, null, null, null, null, null, null, qiniu_config.persistent, qiniu_config.notifyUrl, qiniu_config.persistentPipeline);
    return putPolicy.token();
};

var _makeCallbackBody = function (arr) {
    var temp = '';
    for (var k in arr) {
        temp = temp + "&" + k + "=" + arr[k];
    }
    return qiniu_config.callbackBody + temp;
};

var _makeReturnBody = function(arr){
    var temp = "{\"key\": $(key)";
    for(var k in arr){
        temp = temp + util.format(",\"%s\":\"%s\"", k, arr[k]);
        //putPolicy.returnBody = "{\"key\": $(key), \"hash\": $(etag), \"w\": $(imageInfo.width), \"h\": $(imageInfo.height)}";
    }
    var temp = temp + "}";
    return temp;
};

/**
 * 客户端视频上传uptoken
 * @param params
 * @param key
 */
exports.getVideoUptoken = function (params, key) {
    var putPolicy = {};
    if(util.isNullOrUndefined(key)){
        putPolicy.scope = bucketname;
        putPolicy.persistentOps = qiniu_config.app.video.persistent;
    }else{
        putPolicy.scope = bucketname + ":" + key;
        var saveAs =bucketname + ":" + key + "_v";
        saveAs = qiniu.util.urlsafeBase64Encode(saveAs);
        putPolicy.persistentOps = qiniu_config.app.video.persistent + "|saveas/" + saveAs;
    }
    if (util.isNullOrUndefined(params)) {
        putPolicy.callbackBody = qiniu_config.callbackBody;
    } else {
        var callbackBody = _makeCallbackBody(params);
        putPolicy.callbackBody = callbackBody;
    }
    putPolicy.callbackUrl = qiniu_config.app.video.notifyUrl;
    putPolicy.persistentNotifyUrl = qiniu_config.app.video.persistentNotifyUrl;
    putPolicy.persistentPipeline = qiniu_config.app.video.persistentPipeline;
    var putPolicy2 = new qiniu.rs.PutPolicy2(putPolicy);
    return putPolicy2.token();
};

exports.getVideoUptokenInServer = function (params, key) {
    var putPolicy = {};
    if(util.isNullOrUndefined(key)){
        putPolicy.scope = bucketname;
        putPolicy.persistentOps = qiniu_config.app.video.persistent;
    }else{
        putPolicy.scope = bucketname + ":" + key;
        var saveAs =bucketname + ":" + key + "_v";
        saveAs = qiniu.util.urlsafeBase64Encode(saveAs);
        putPolicy.persistentOps = qiniu_config.app.video.persistent + "|saveas/" + saveAs;
    }
    putPolicy.returnBody = _makeReturnBody(params);
    //if (util.isNullOrUndefined(params)) {
    //    putPolicy.callbackBody = qiniu_config.callbackBody;
    //} else {
    //    var callbackBody = _makeCallbackBody(params);
    //    putPolicy.callbackBody = callbackBody;
    //}
    //putPolicy.callbackUrl = qiniu_config.app.video.notifyUrl;
    putPolicy.persistentNotifyUrl = qiniu_config.app.video.persistentNotifyUrl;
    putPolicy.persistentPipeline = qiniu_config.app.video.persistentPipeline;
    var putPolicy2 = new qiniu.rs.PutPolicy2(putPolicy);
    return putPolicy2.token();
};

/**
 * 客户端图片上传uptoken
 * @param params
 */
exports.getPhotoUptoken = function (params, key) {
    var putPolicy;
    if(util.isNullOrUndefined(key)){
        putPolicy = new qiniu.rs.PutPolicy(bucketname);
    }else{
        putPolicy = new qiniu.rs.PutPolicy(bucketname + ":" + key);
    }
    if (util.isNullOrUndefined(params)) {
        putPolicy.callbackBody = qiniu_config.callbackBody;
    } else {
        var callbackBody = _makeCallbackBody(params);
        putPolicy.callbackBody = callbackBody;
    }
    putPolicy.callbackUrl = qiniu_config.app.photo.notifyUrl;
    return putPolicy.token();
};

/**
 * 服务端图片上传uptoken
 * @param params
 * @param key
 */
exports.getPhotoUptokenInServer = function (params, key) {
    var putPolicy = new qiniu.rs.PutPolicy(bucketname + ":" + key);
    //putPolicy.returnBody = _makeReturnBody(params);
    console.log(putPolicy);
    return putPolicy.token();
};

/**
 * 客户端模型文件上传uptoken
 * @param params
 */
exports.getModelFileUptoken = function (params, key) {
    var putPolicy;
    if(util.isNullOrUndefined(key)){
        putPolicy = new qiniu.rs.PutPolicy(bucketname);
    }else{
        putPolicy = new qiniu.rs.PutPolicy(bucketname + ":" + key);
    }
    if (util.isNullOrUndefined(params)) {
        putPolicy.callbackBody = qiniu_config.callbackBody;
    } else {
        var callbackBody = _makeCallbackBody(params);
        putPolicy.callbackBody = callbackBody;
    }
    putPolicy.callbackUrl = qiniu_config.app.modelFile.notifyUrl ;
    return putPolicy.token();
};

exports.getModelFileUptokenInServer = function (params, key) {
    var putPolicy;
    if(util.isNullOrUndefined(key)){
        putPolicy = new qiniu.rs.PutPolicy(bucketname);
    }else{
        putPolicy = new qiniu.rs.PutPolicy(bucketname + ":" + key);
    }
    //if (util.isNullOrUndefined(params)) {
    //    putPolicy.callbackBody = qiniu_config.callbackBody;
    //} else {
    //    var callbackBody = _makeCallbackBody(params);
    //    putPolicy.callbackBody = callbackBody;
    //}
    putPolicy.returnBody = _makeReturnBody(params);
    //putPolicy.callbackUrl = qiniu_config.app.modelFile.notifyUrl ;
    return putPolicy.token();
};

/**
 * 视频取帧
 * @param params
 * @param key另存为的key
 */
exports.getFrame = function(key, target){
    console.log(key);
    var deferred = Q.defer();
    var saveAs =bucketname + ":" + target;
    saveAs = qiniu.util.urlsafeBase64Encode(saveAs);
    var fops = qiniu_config.app.frame.persistent +  "|saveas/" + saveAs;
    var opts = {
        //notifyUrl:qiniu_config.app.frame.notifyUrl,
        force:1,
        pipeline:qiniu_config.app.frame.persistentPipeline
    };
    qiniu.fop.pfop(qiniu_config.bucket,key, fops, opts, function(err, result, res){
        console.log(result);
        if(err){
            deferred.reject(err);
        }else{
            deferred.resolve(result);
        }
    });

    return deferred.promise;
};


/**
 * 根据key获得url
 * @param key
 * @returns {string}
 */
exports.getFileUrl = function(key){
    return "http://" + qiniu_config.domain + "/" + key;
};



exports.getUpToken = getUpToken;

var uploadBuf = function (body, key, uptoken) {
    var deferred = Q.defer();
    var extra = new qiniu.io.PutExtra();

    qiniu.io.put(uptoken, key, body, extra, function (err, ret) {
        if (!err) {
            deferred.resolve(ret);
        } else {
            deferred.reject(err);
        }
    });
    return deferred.promise;
};

var uploadFile = function (localFile, key, uptoken) {
    var deferred = Q.defer();
    var extra = new qiniu.io.PutExtra();

    qiniu.io.putFile(uptoken, key, localFile, extra, function (err, ret) {
        if (!err) {
            deferred.resolve(ret);
        } else {
            deferred.reject(err);
        }
    });
    return deferred.promise;
};



/**
 * ������Դ���ص�ַ
 * @param domain
 * @param key
 * @returns {string}
 */
var downloadUrlPublic = function (domain, key) {
    return "http://" + domain + "/" + key;
};
/**
 * ˽����Դ���ص�ַ
 * @param domain
 * @param key
 */
var downloadUrlPrivate = function (domain, key) {
    var baseUrl = qiniu.rs.makeBaseUrl(domain, key);
    var policy = new qiniu.rs.GetPolicy();
    return policy.makeRequest(baseUrl);
};
exports.downloadUrlPrivate = downloadUrlPrivate;
/**
 * ����ļ����?
 * @param bucketName
 * @param key
 * @returns {deferred.promise|{then, catch, finally}}
 */
var getFileInfo = function (bucketName, key) {
    var deferred = Q.defer();
    client.stat(bucketName, key, function (err, ret) {
        if (!err) {
            deferred.resolve(ret);
        } else {
            deferred.reject(err);
        }
    });
    return deferred.promise;
};

var removeFile = function (bucketName, key) {
    var deferred = Q.defer();
    client.remove(bucketName, key, function (err, ret) {
        if (!err) {
            deferred.resolve(ret);
        } else {
            deferred.reject(err);
        }
    });
    return deferred.promise;
};

var copyFile = function (bucketSrc, keySrc, bucketDest, keyDest) {
    var deferred = Q.defer();
    client.copy(bucketSrc, keySrc, bucketDest, keyDest, function (err, ret) {
        if (!err) {
            deferred.resolve(ret);
        } else {
            deferred.reject(err);
        }
    });
    return deferred.promise;
};

var moveFile = function (bucketSrc, keySrc, bucketDest, keyDest) {
    var deferred = Q.defer();
    client.move(bucketSrc, keySrc, bucketDest, keyDest, function (err, ret) {
        if (!err) {
            deferred.resolve(ret);
        } else {
            deferred.reject(err);
        }
    });
    return deferred.promise;
};

