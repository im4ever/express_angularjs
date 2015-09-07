/**
 * Created by im4ever on 2015/7/16.
 */
var Sequelize = require('sequelize');
var sequelize = require('./../lib/mysqlHelper');
var db = sequelize.db;
var orm_model=require('./model_model');
var orm_user=require('./user_model');
var orm_userModelsDownload = db.define('user_models_download',
    {
        id:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        uid:{type:Sequelize.INTEGER},
        mid:{type:Sequelize.INTEGER},
        score:{type:Sequelize.INTEGER},
        isScore:{type:Sequelize.INTEGER}
    },
    {
        tableName:'user_models_download'

    }
);
orm_userModelsDownload.belongsTo(orm_model,{foreignKey:'mid'});
module.exports = orm_userModelsDownload;