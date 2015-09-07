/**
 * Created by qufan on 2015/7/24 0024.
 */

var nodemailer = require("nodemailer");
var Q = require('q');
var user = "ubtech@nvshengpai.com", password = "nvshengpai123";
var smtpTransport = nodemailer.createTransport(
    {
        service:"QQex",
        auth:{
            user:user,
            pass:password
        }
    }
);

//smtpTransport.sendMail(
//    {
//        from:user,
//        to:'allen5858@163.com',
//        subject:'node js 通过smtp',
//        html:'这是一分'
//    },
//    function(err, res){
//        console.log(err,res);
//    }
//);


var sendMail = function(to, subject, html){
    var deferred = Q.defer();

    smtpTransport.sendMail(
        {
          from:user,
          to:to,
          subject:subject,
          html:html
        },
        function(err, res){
            console.log(err,res);
            if(err == null){
                deferred.resolve();
            }else{
                deferred.reject(err);
            }
        }
    );
    return deferred.promise;
};

exports.sendMail = sendMail;
