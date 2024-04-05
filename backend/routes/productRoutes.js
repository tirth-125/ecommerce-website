const express = require("express");
const router = express.Router();
const productController = require("../controller/productController");
const userController = require("../middleware/tokenAuthorizaton");


router.route('/products').get(userController.authorization,userController.authorizeRoles("admin"),productController.getAllproduct);
router.route('/product/new').post(userController.authorization,productController.createProduct);
router.route('/product/:id').put(userController.authorization,productController.updateProduct)
.delete(userController.authorization,productController.deleteProduct).get(productController.getProductdetails);




module.exports = router; 