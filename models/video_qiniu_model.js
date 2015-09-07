/**
 * Created by qufan on 2015/8/26.
 */
var Sequelize = require('sequelize');
var sequelize = require('./../lib/mysqlHelper');
var db = sequelize.db;

var orm_video_qiniu = db.define('video_qiniu',
    {
        vid:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        uid:{type:Sequelize.INTEGER},
        mid:{type:Sequelize.INTEGER},
        url:{type:Sequelize.STRING},
        purl:{type:Sequelize.STRING},
        size:{type:Sequelize.INTEGER},
        during:{type:Sequelize.INTEGER},
        status:{type:Sequelize.INTEGER},
        ctime:{type:Sequelize.INTEGER},
        callbackTime:{type:Sequelize.INTEGER}
    },
    {
        tableName:'video_qiniu'
    }
);

module.exports = orm_video_qiniu;