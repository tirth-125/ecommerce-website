const sendToken = async (user,statusCode,res,message)=>{
        const token = await user.getJWTToken();

        // options for cookie
        const options = {
            expires : new Date(
                Date.now() + process.env.COOKIE_EXP*24*60*60*1000
        ),
            httpOnly :true,
        };

        res.status(statusCode).cookie("token",token,options).json({
            success : true,
            token,
            message
        });
}

module.exports=sendToken;