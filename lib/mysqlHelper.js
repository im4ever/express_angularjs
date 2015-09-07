/**
 * Created by qufan on 2015/7/9 0009.
 * mysql数据库操作助手
 */

var Sequelize = require('sequelize');
var dbSettings = require('./../config/config').db;

var db = new Sequelize(dbSettings.database, dbSettings.user, dbSettings.password,
    {
        host:dbSettings.host,
        port:dbSettings.port,
        dialect:'mysql',
        pool:dbSettings.pool,
        define:{
            timestamps:false,
            freezeTableName:true
        }
    }
);


//db.query("select * from robot_user", {type:Sequelize.QueryTypes.SELECT}).then(function(users){
//        console.log(users);
//    },
//    function(err){
//        console.log(err);
//    }
//)

exports.db = db;

