var express = require('express');
var router = express.Router();
var CreditController = require('./../controllers/credit_controller');


router.get('/setScore/:action',function(req,res){
    var creditController=new CreditController(req,res);
    creditController.setScore();
});
module.exports = router;