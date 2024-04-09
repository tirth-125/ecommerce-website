const User = require("../model/userModel");
const asyncHandler = require("../middleware/asyncErrorhandler");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/sendtoken");
const sendemail = require("../utils/email");
const asyncErrorhandler = require("../middleware/asyncErrorhandler");
const crypto = require("crypto");

// Register the user
exports.registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const newUser = await User.create({
        name, email, password, avatar: {
            public_id: "852554522",
            url: "ProfilePicUrl",
        }
    });
    // const token = await newUser.getJWTToken();
    // console.log(token);
    const message = "User Register Successfully";
    sendToken(newUser, token, res, message);

});

// Login User 
exports.loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler("Please Provide Email and Password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || (!await user.compPswd(password))) {
        return next(new ErrorHandler("Invalid username or password", 404));
    }
    // const token = await user.getJWTToken();
    const message = "User login Successfully";
    sendToken(user, 200, res, message);
});

//  Logout User 
exports.logoutUser = asyncHandler(async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({
        success: true,
        message: "user logout successfully"
    });
});

// Forgot Password
exports.forgotPassword = asyncHandler(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        next(new ErrorHandler("User is not found", 404));
    }
    // console.log(user.getResetPasswordToken());
    const resetToken = await user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // console.log(resetToken);

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is below \n ${resetPasswordUrl} \n It's valid only for 15 minutes`

    try {
        await sendemail({
            email: user.email,
            subject: "Regarding your e-commerce website",
            message: message,
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 400));
    }
    next();
});

// Reset Passsword
exports.resetPassword = asyncErrorhandler(async (req, res, next) => {

    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    // console.log(resetPasswordToken, " = rpt");
    const user = await User.findOne({ resetPasswordToken });
    // console.log(user, " = user");
    if (!user) {
        return next(new ErrorHandler("User is not found on this url or url time is expire", 400));
    }

    if (req.body.password != req.body.confirmPassword) {
        return next(new ErrorHandler("User password is not match", 404));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();


    res.status(200).json({
        data: {
            user
        }
    });

    next();
});

//  Get User details ((user)particuler user mate)
exports.getUserDetails = asyncErrorhandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        daat: {
            user
        }
    })
});

// Update user password 
exports.updatePassword = asyncErrorhandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");
    // console.log(user.password, " = up");
    const isMatchPassword = await user.compPswd(req.body.oldPassword);
    // console.log(isMatchPassword, "op");
    if (!isMatchPassword) {
        return next(new ErrorHandler("Old password is incorrect"));
    }

    if (req.body.newPassword != req.body.confirmPassword) {
        return next(new ErrorHandler("newPassword and confirmPassword is not match"));
    }
    // console.log(req.body.newPassword, "= np");
    // console.log(req.body.confirmPassword, "= cp");

    user.password = req.body.newPassword;

    await user.save();

    res.status(200).json({
        success: true,
        data: {
            user
        }
    });
});



//  update user profile (user side)
exports.updateUserprofile = asyncErrorhandler(async (req, res, next) => {
    const userData = {
        email: req.body.email,
        name: req.body.name
    }

    const user = await User.findByIdAndUpdate(req.user.id, userData, { runValidators: true, new: true, useFindAndModify: false });
    res.status(200).json({
        success : true,
        user,
        message : "User profile is updated"
    });
});

//  get all users (admin)
 exports.getAlluser = asyncErrorhandler(async(req,res,next)=>{
    const users = await User.find({});

    res.status(200).json({
        length : users.length,
        data : {
            users
        },
        message : " Data For Admin"
    });
 });


//   get single user (admin)
 exports.getSingleuser = asyncErrorhandler(async(req,res,next)=>{
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User does not exist this id ${req.params.id}`,404));
    }
    res.status(200).json({
        data : {
            user
        },
        message : " Data For Admin"
    });
 });

//  update role by ADMIN (admin)
exports.updateUserrole = asyncErrorhandler(async (req, res, next) => {
    const userData = {
        email: req.body.email,
        name: req.body.name,
        role : req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, userData, { runValidators: true, new: true, useFindAndModify: false });
    if (!user) {
        return next(new ErrorHandler(`User does not exist this id ${req.params.id}`,404));
    }
    res.status(200).json({
        success : true,
        user,
        message : "User profile is updated by Admin side"
    });
});

//  Dlete user by Admin side (admin) 

exports.deleteUserprofile = asyncErrorhandler(async (req, res, next) => {
    

    const user = await User.findByIdAndDelete(req.params.id, { runValidators: true, new: true, useFindAndModify: false });
    if (!user) {
        return next(new ErrorHandler(`User does not exist this id ${req.params.id}`,404));
    }
    res.status(200).json({
        success : true,
        user,
        message : "User is deleted by admin"
    });
    next();
});