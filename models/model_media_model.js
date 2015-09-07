/**
 * Created by qufan on 2015/7/22 0022.
 * 把和模型相关的图片和视频整合到一个media类型中
 */
var Sequelize = require('sequelize');
var sequelize = require('./../lib/mysqlHelper');
var db = sequelize.db;
var orm_model = require('./model_model');

var orm_model_media = db.define('model_media',
    {
        id:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        mid:{type:Sequelize.INTEGER},
        purl:{type:Sequelize.STRING},
        mediaType:{type:Sequelize.INTEGER},
        videoUrl:{type:Sequelize.STRING},
        ctime:{type:Sequelize.INTEGER}

    },
    {
        tableName:'model_media'
    }
);

orm_model.hasMany(orm_model_media, {foreignKey:'mid'});
//orm_model_media.belongsTo(orm_model, {foreignKey:'mid'});
module.exports = orm_model_media;