/**
 * Created by qufan on 2015/7/28 0028.
 */
var Sequelize = require('sequelize');
var sequelize = require('./../lib/mysqlHelper');
var db = sequelize.db;

var orm_video_cc_callback = db.define('video_cc_callback',
    {
        id:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        ctime:{type:Sequelize.DATE},
        videoid:{type:Sequelize.STRING},
        status:{type:Sequelize.STRING},
        during:{type:Sequelize.INTEGER},
        image:{type:Sequelize.STRING},
        json:{type:Sequelize.STRING}
    },
    {
        tableName:'video_cc_callback'
    }
);

module.exports = orm_video_cc_callback;