/**
 * Created by im4ever on 2015/7/14.
 */
var Sequelize = require('sequelize');
var sequelize = require('./../lib/mysqlHelper');
var db = sequelize.db;
var orm_product=require('./product_model');
var orm_userProducts = db.define('user_products',
    {
        id:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        uid:{type:Sequelize.INTEGER},
        pid:{type:Sequelize.INTEGER}
    },
    {
        tableName:'user_products'

    }
);
orm_userProducts.belongsTo(orm_product,{foreignKey:'pid'});
orm_product.belongsTo(orm_userProducts,{foreignKey:'pid'});
module.exports = orm_userProducts;