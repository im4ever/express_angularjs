/**
 * Created by qufan on 2015/7/15 0015.
 */
var Sequelize = require('sequelize');
var sequelize = require('./../lib/mysqlHelper');
var db = sequelize.db;

var orm_photo = db.define('photo',
    {
        pid:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        uid:{type:Sequelize.INTEGER},
        mid:{type:Sequelize.INTEGER},
        isThumb:{type:Sequelize.INTEGER},
        url:{type:Sequelize.STRING},
        status:{type:Sequelize.INTEGER},
        imageType:{type:Sequelize.INTEGER},
        ctime:{type:Sequelize.INTEGER},
        callbackTime:{type:Sequelize.INTEGER}
    },
    {
        tableName:'photo'
    }
);

module.exports = orm_photo;