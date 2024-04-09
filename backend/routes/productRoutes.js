const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");
const userController = require("../middleware/tokenAuthorizaton");


router.route('/products').get(productController.getAllproduct);

router.route('/admin/product/new').post(userController.authorization,userController.authorizeRoles("admin"),productController.createProduct);

router.route('/admin/product/:id')
.put(userController.authorization,userController.authorizeRoles("admin"),productController.updateProduct)
.delete(userController.authorization,userController.authorizeRoles("admin"),productController.deleteProduct)

router.route('/product/:id').get(productController.getProductdetails);




module.exports = router; 