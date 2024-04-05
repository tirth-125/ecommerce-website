const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Provide the User name"],
        maxLength: [30, "Name Cannot Exceed 30 characters"],
        minLength: [4, "Name is greterthan more characters"]
    },
    email: {
        type: String,
        required: [true, "Prvide the user email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter The Valid Email"]
    },
    password: {
        type: String,
        required: [true, "Prvide the user password"],
        minLength: [8, "Password length is must be 8 Characters"],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        }
    },
    role: {
        type: String,
        default: "user"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,

});

userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.getJWTToken = async function () {
    return jwt.sign({ id: this._id }, process.env.SECRET_STR, {
        expiresIn: process.env.JWT_EXP
    });
};

userSchema.methods.compPswd = async function (password) {
    return await bcrypt.compare(password, this.password);
}

const User = new mongoose.model("User", userSchema);
module.exports = User;
