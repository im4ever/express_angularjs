/**
 * Created by im4ever on 2015/7/24.
 */
var Sequelize = require('sequelize');
var sequelize = require('./../lib/mysqlHelper');
var db = sequelize.db;
var orm_user=require('./user_model');
var orm_modelComment = db.define('model_comment',
    {
        commentId:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        uid:{type:Sequelize.INTEGER},
        mid:{type:Sequelize.INTEGER},
        content:{type:Sequelize.STRING},
        ctime:{type:Sequelize.INTEGER}
    },
    {
        tableName:'model_comment'
    }
);
orm_modelComment.belongsTo(orm_user,{foreignKey:'uid'});
module.exports = orm_modelComment;