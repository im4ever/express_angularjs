/**
 * Created by qufan on 2015/8/19.
 */

"use strict";
var config = require('./config');

var qiniu_config = {
    accessKey:"OJb5DHhgOxDo42se8R2JvwLyaykWLUBYowqMA3Nu",
    secretKey:"tRfcP40zLvGUwfVANQEClOnyn2ATb2spLki9K7cH",
    bucket:'buildingrobot',
    callbackBody:"key=$(key)",
    domain:'7xlcoq.com1.z0.glb.clouddn.com',
    app:{
        photo:{
            notifyUrl:config.server_url + "/callback/qiniu_photo"
        },
        video:{
            notifyUrl:config.server_url + "/callback/qiniu_video",
            persistent:"avthumb/mp4/vb/128k",
            persistentPipeline:"video",
            persistentNotifyUrl:config.server_url + "/callback/qiniu_video_persistent",
        },
        modelFile:{
            notifyUrl:config.server_url + "/callback/qiniu_modelFile"
        },
        frame:{
            persistentPipeline:"photo",
            persistent:"vframe/jpg/offset/1/w/360/h/360"
        }
    },

    //notifyUrl:'http://localhost/callback/persistent',

    persistentClient:"avthumb/mp4/vb/128k",
    persistentFrame:"vframe/jpg/offset/1/w/360/h/360",//��Ƶȡ֡����



    //photoNotifyUrl:config.server_url + "/callback/qiniu_photo",
    //videoNotifyUrl:config.server_url+"/callback/qiniu_video",
    //videoPersistentNotifyUrl:config.server_url + "/callback/qiniu_video_persistent",
    //modelFileNotifyUrl:config.server_url+"/callback/qiniu_modelFile"
};

module.exports = qiniu_config;