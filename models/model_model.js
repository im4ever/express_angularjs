/**
 * Created by im4ever on 2015/7/10.
 */
var Sequelize = require('sequelize');
var sequelize = require('./../lib/mysqlHelper');
var db = sequelize.db;

var orm_product=require('./product_model');
var orm_directive=require('./directive_model');
var orm_user=require('./user_model');
var orm_model_parts=require('./model_parts_model');
var orm_part=require('./part_model');
var orm_model_type = require('./model_type_model');
var orm_model_comment=require('./model_comment_model');
var orm_model = db.define('model',
    {
        mid:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        mfid:{type:Sequelize.INTEGER},
        vid:{type:Sequelize.INTEGER},
        pids:{type:Sequelize.STRING},
        title:{type:Sequelize.STRING},
        tid:{type:Sequelize.INTEGER},
        url:{type:Sequelize.STRING},
        actions:{type:Sequelize.STRING},
        thumb:{type:Sequelize.STRING},
        ctime:{type:Sequelize.INTEGER},
        pid:{type:Sequelize.INTEGER},
        author:{type:Sequelize.INTEGER},
        isNew:{type:Sequelize.INTEGER},
        score:{type:Sequelize.INTEGER},
        nop:{type:Sequelize.INTEGER},
        status:{type:Sequelize.INTEGER},
        recommendModels:{type:Sequelize.STRING},
        praise:{type:Sequelize.INTEGER}

    },
    {
        tableName:'model'
    }
);
//orm_model.hasMany(orm_product,{as:'orm_product'});
orm_product.hasMany(orm_model,{foreignKey:'pid'});
orm_model.hasMany(orm_directive,{foreignKey:'mid'});
orm_model.hasMany(orm_model_parts,{foreignKey:'mid'});
orm_model.hasMany(orm_model_comment,{foreignKey:'mid'});
orm_model_comment.belongsTo(orm_model,{foreignKey:'mid'});
orm_model_parts.hasOne(orm_part,{foreignKey:'pid'});
orm_model.belongsTo(orm_user,{foreignKey:'author'});
orm_model_type.hasOne(orm_model,{foreignKey:'tid'});
orm_model.belongsTo(orm_model_type,{foreignKey:'tid'});
//orm_model.belongsTo(orm_model_type, {foreignKey:'tid'});
module.exports = orm_model;
