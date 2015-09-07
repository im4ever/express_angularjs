var Sequelize = require('sequelize');
var sequelize = require('./../lib/mysqlHelper');
var orm_model=require('./model_model');
var db = sequelize.db;

var orm_model_praise = db.define('model_praise',
    {
        id:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        mid:{type:Sequelize.INTEGER},
        praise:{type:Sequelize.INTEGER}
    },
    {
        tableName:'model_praise'

    }
);
orm_model_praise.hasOne(orm_model,{foreignKey:'mid'});
module.exports = orm_model_praise;