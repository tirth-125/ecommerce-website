const express = require("express");
const  userController  = require("../controller/userController");
const router = express.Router();

router.route('/register').post(userController.registerUser);
router.route('/login').post(userController.loginUser);
router.route('/logout').get(userController.logoutUser);
router.route('/forgotpassword').post(userController.forgotPassword);
router.route('/password/reset/:token').put(userController.resetPassword);




module.exports = router;
