var userCreditModel = require('./../models/user_credit_model'),
    userCreditLogModel = require('./../models/user_credit_log_model'),
    customUtils = require('./../lib/customUtils'),
    constDefine = require('./../lib/const'),
    util = require('util'),
    moment=require('moment'),
    pushLogic=require('./push_logic'),
    Q = require('q');
/**
 * @type object
 * @param action
 * uid,score,ctime,description
 */
exports.setScore=function(action,pushID){
    var deferred = Q.defer();
    var record={uid:action.uid,score:action.score,ctime:moment().format("YYYY-MM-DD HH:mm:ss"),description:action.description};
    userCreditLogModel.create(record).then(function(data){
        userCreditModel.findById(action.uid).then(function(user) {
            return user.increment('score', {by: action.score});
        }).then(function(data){
            if(pushID){
                console.log(111+'+++++++++');
                pushLogic.textPushToSingle(pushID,(constDefine.SCORE_PUSH+action.score),constDefine.MESSAGE_TYPE_BONUS).then();
            }
            deferred.resolve(data);
        },function(err){
            deferred.reject(err);
        })
    },function(err){
        deferred.reject(err);
    });
    return deferred.promise;
};