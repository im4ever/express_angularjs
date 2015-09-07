/**
 * Created by qufan on 2015/8/27.
 */
var Sequelize = require('sequelize');
var sequelize = require('./../lib/mysqlHelper');
var db = sequelize.db;

var orm_model_file = db.define('model_file',
    {
        mfid:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        uid:{type:Sequelize.INTEGER},
        mid:{type:Sequelize.INTEGER},
        url:{type:Sequelize.STRING},
        modelName:{type:Sequelize.STRING},
        size:{type:Sequelize.INTEGER},
        actions:{type:Sequelize.STRING},
        parts:{type:Sequelize.STRING},
        status:{type:Sequelize.INTEGER},
        ctime:{type:Sequelize.INTEGER},
        callbackTime:{type:Sequelize.INTEGER}
    },
    {
        tableName:'model_file'
    }
);

module.exports = orm_model_file;