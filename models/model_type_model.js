/**
 * Created by qufan on 2015/7/21 0021.
 */
var Sequelize = require('sequelize');
var sequelize = require('./../lib/mysqlHelper');
var db = sequelize.db;

var orm_model_type = db.define('model_type',
    {
        tid:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        title:{type:Sequelize.STRING},
        ctime:{type:Sequelize.INTEGER},
        isDel:{type:Sequelize.INTEGER}
    },
    {
        tableName:'model_type'

    }
);
module.exports = orm_model_type;