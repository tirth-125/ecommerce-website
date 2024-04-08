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
    sendToken(newUser,token,res,message);
    
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
    sendToken(user,200,res,message);
});

//  Logout User 
exports.logoutUser = asyncHandler(async(req,res)=>{
    res.cookie("token",null,{
        expires : new Date(Date.now()),
        httpOnly : true,
    });
    res.status(200).json({
        success : true,
        message : "user logout successfully"
    });
});

// Forgot Password
exports.forgotPassword = asyncHandler(async(req,res,next)=>{
    
    const user = await User.findOne({email : req.body.email});
    if (!user) {
        next(new ErrorHandler("User is not found",404));
    }
    // console.log(user.getResetPasswordToken());
    const resetToken = await user.getResetPasswordToken();

    await user.save({validateBeforeSave : false});

    // console.log(resetToken);

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is below \n ${resetPasswordUrl} \n It's valid only for 15 minutes`

    try {
        await sendemail({
            email : user.email,
            subject : "Regarding your e-commerce website",
            message : message,
        });
        res.status(200).json({
            success : true,
            message : `Email sent to ${user.email} successfully`
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave: false});

        return next(new ErrorHandler(error.message,400));
    }
    next(); 
});

exports.resetPassword =  asyncErrorhandler(async(req,res,next)=>{

    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    console.log(resetPasswordToken ," = rpt");
    const user = await User.findOne({resetPasswordToken});
    console.log(user ," = user");
    if (!user) {
        return next(new ErrorHandler("User is not found on this url or url time is expire",400));
    }

    if (req.body.password != req.body.confirmPassword) {
        return next(new ErrorHandler("User password is not match",404));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();


    res.status(200).json({
        data : {
            user
        }
    })

    next();
});