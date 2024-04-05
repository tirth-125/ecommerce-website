const ErrorHandler = require("../utils/errorHandler");
const asyncHandler = require("./asyncErrorhandler");
const util = require("util");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");


exports.authorization = asyncHandler(async function (req, res, next) {
    const { token } = req.cookies;
    if (!token) {
        next(new ErrorHandler("User is not logged in"));
    }
    const decodedToken = jwt.verify(token, process.env.SECRET_STR);

    req.user = await User.findById(decodedToken.id);
    next();
});

exports.authorizeRoles = (...roles) => {
    // req.user = await User.findById(decodedToken.id);
    return (req, res, next) => {
        if (!(roles.includes(req.user.role))) {
            return next(new ErrorHandler(`Roles: ${req.user.role} is not allowed to access this resource`,403));
        };
        next();
    };
};