/**
 * Created by im4ever on 2015/7/22.
 */
var Sequelize = require('sequelize');
var sequelize = require('./../lib/mysqlHelper');
var db = sequelize.db;
var orm_part=require('./part_model');
var orm_product=require('./product_model');
var orm_productParts = db.define('product_parts',
    {
        id:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        product_id:{type:Sequelize.INTEGER},
        part_id:{type:Sequelize.INTEGER},
        count:{type:Sequelize.INTEGER}
    },
    {
        tableName:'product_parts'
    }
);


orm_productParts.belongsTo(orm_part,{foreignKey:'part_id'});
orm_product.hasMany(orm_productParts,{foreignKey:'product_id'});
module.exports = orm_productParts;