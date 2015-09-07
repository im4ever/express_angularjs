 /**
 * Created by yuanchi on 2015/7/10 .
 */
var Sequelize = require('sequelize');
var sequelize = require('./../lib/mysqlHelper');
var db = sequelize.db;
var orm_product_type = require('./product_type_model');

var orm_product = db.define('product',
    {
        pid:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        name:{type:Sequelize.STRING},
        isNew:{type:Sequelize.INTEGER},
        tid:{type:Sequelize.INTEGER},
        ctime:{type:Sequelize.INTEGER},
        buildInfo:{type:Sequelize.STRING},
        description:{type:Sequelize.STRING},
        url:{type:Sequelize.STRING},
        recommendModels:{type:Sequelize.STRING}
    },
    {
        tableName:'product'
    }
);
orm_product.belongsTo(orm_product_type,{foreignKey:'tid'});
module.exports = orm_product;