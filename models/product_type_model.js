/**
 * Created by qufan on 2015/7/21 0021.
 */
var Sequelize = require('sequelize');
var sequelize = require('./../lib/mysqlHelper');
var db = sequelize.db;

var orm_product_type = db.define('product_type',
    {
        tid:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        title:{type:Sequelize.STRING}
    },
    {
        tableName:'product_type'

    }
);
module.exports = orm_product_type;