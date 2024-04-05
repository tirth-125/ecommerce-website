const User = require("../model/userModel");
const asyncHandler = require("../middleware/asyncErrorhandler");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/sendtoken");
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
})