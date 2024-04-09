const express = require("express");
const  userController  = require("../controller/userController");
const userAuth = require("../middleware/tokenAuthorizaton");

const router = express.Router();


// For User
router.route('/register').post(userController.registerUser);
router.route('/login').post(userController.loginUser);
router.route('/logout').get(userController.logoutUser);
router.route('/forgotpassword').post(userController.forgotPassword);
router.route('/password/reset/:token').put(userController.resetPassword);

//  For User Updatetion
router.route('/getUserDetails').get(userAuth.authorization,userController.getUserDetails);
router.route('/updatePassword').put(userAuth.authorization,userController.updatePassword);
router.route('/updateUserProfile').put(userAuth.authorization,userController.updateUserprofile);

// For Admin
router.route('/admin/users').get(userAuth.authorization,userAuth.authorizeRoles("admin"),userController.getAlluser);
router
.route('/admin/user/:id')
.get(userAuth.authorization,userAuth.authorizeRoles("admin"),userController.getSingleuser)
.put(userAuth.authorization,userAuth.authorizeRoles("admin"),userController.updateUserrole)
.delete(userAuth.authorization,userAuth.authorizeRoles("admin"),userController.deleteUserprofile);


module.exports = router;
