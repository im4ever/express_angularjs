/**
 * Created by im4ever on 2015/7/20.
 */
var Sequelize = require('sequelize');
var sequelize = require('./../lib/mysqlHelper');
var orm_part=require('./part_model');
var db = sequelize.db;

var orm_model_parts = db.define('model_parts',
    {
        id:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        mid:{type:Sequelize.INTEGER},
        pid:{type:Sequelize.INTEGER}
    },
    {
        tableName:'model_parts'

    }
);
module.exports = orm_model_parts;
