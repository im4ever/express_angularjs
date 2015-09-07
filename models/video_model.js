/**
 * Created by qufan on 2015/7/21 0021.
 */
var Sequelize = require('sequelize');
var sequelize = require('./../lib/mysqlHelper');
var db = sequelize.db;

var orm_video = db.define('video',
    {
        vid:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        uid:{type:Sequelize.INTEGER},
        ccVideoid:{type:Sequelize.STRING},
        purl:{type:Sequelize.STRING},
        size:{type:Sequelize.INTEGER},
        isRecommend:{type:Sequelize.INTEGER},
        during:{type:Sequelize.INTEGER},
        description:{type:Sequelize.STRING},
        status:{type:Sequelize.INTEGER},
        ctime:{type:Sequelize.INTEGER}
    },
    {
        tableName:'video'
    }
);

module.exports = orm_video;