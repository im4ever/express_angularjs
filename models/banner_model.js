/**
 * Created by qufan on 2015/7/22 0022.
 * 把和模型相关的图片和视频整合到一个media类型中
 */
var Sequelize = require('sequelize');
var sequelize = require('./../lib/mysqlHelper');
var db = sequelize.db;

var orm_banner = db.define('banner',
    {
        id:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        purl:{type:Sequelize.STRING},
        mediaType:{type:Sequelize.INTEGER},
        videoUrl:{type:Sequelize.STRING},
        ctime:{type:Sequelize.INTEGER}

    },
    {
        tableName:'banner'
    }
);

//orm_model_media.belongsTo(orm_model, {foreignKey:'mid'});
module.exports = orm_banner;