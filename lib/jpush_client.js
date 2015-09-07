var JPush = require('jpush-sdk');
var jpush_config = require('./../config/jpush_config');
var Q = require('q');

var client=JPush.buildClient(jpush_config.AppKey,jpush_config.MasterSecret);

//easy push
var push=function(){
    var deferred = Q.defer();
    client.push().setPlatform(JPush.ALL)
        .setAudience(JPush.ALL)
        .setNotification('Hi, JPush', JPush.ios('ios alert', 'happy.caf', 5))
        .send(function(err, res) {
            if (err) {
                console.log(err.message);
                deferred.reject(err);
            } else {
                console.log('Sendno: ' + res.sendno);
                console.log('Msg_id: ' + res.msg_id);
                deferred.resolve(res);
            }
        });
    return deferred.promise;
};
exports.push=push;

//高级版
var advancedPush=function(content,extra){
    var deferred = Q.defer();
    client.push().setPlatform('ios', 'android')
        .setAudience(JPush.ALL)
        .setNotification(content, JPush.ios(content,null,null,null,extra), JPush.android(content, null, 1,extra))
        .setMessage('msg content')
        .setOptions(null, 60)
        .send(function(err, res) {
            if (err) {
                deferred.reject(err);
                console.log(err.message);
            } else {
                console.log('Sendno: ' + res.sendno);
                console.log('Msg_id: ' + res.msg_id);
                deferred.resolve(res);
            }
        });
    return deferred.promise;
};
exports.advancedPush=advancedPush;
var singlePush=function(registration_id,content,extra){
    var deferred = Q.defer();
    client.push().setPlatform('ios', 'android')
        .setAudience(JPush.registration_id([registration_id]))
        .setNotification(content, JPush.ios(content,null,null,null,extra), JPush.android(content, null, 1,extra))
        .setMessage('msg content')
        .setOptions(null, 60)
        .send(function(err, res) {
            if (err) {
                console.log (err.message);
                deferred.reject(err);
            } else {
                console.log ('Sendno: ' + res.sendno+'Msg_id: ' + res.msg_id);
                deferred.resolve(res);
            }
        });
    return deferred.promise;
};
exports.singlePush=singlePush;