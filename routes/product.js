/**
 * Created by im4ever on 2015/7/11.
 */
var express = require('express');
var router = express.Router();
var ProductController = require('./../controllers/product_controller'),
    UserProductsController = require('./../controllers/userProducts_controller');
router.get('/info/:pid',function(req,res){
    var productController =new ProductController(req,res);
    productController.info();
});
router.all('/info',function(req,res){
    var productController =new ProductController(req,res);
    productController.info();
});
router.all('/my',function(req,res){
    var userProductsController =new UserProductsController(req,res);
    userProductsController.getProducts();
});
router.get('/all',function(req,res){
    var productController =new ProductController(req,res);
    productController.getProducts();
});

router.all('/add', function(req, res){
    var productController =new ProductController(req,res);
    productController.addProduct();
});

module.exports = router;
