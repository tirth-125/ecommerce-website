const mongoose = require("mongoose");
const dotenv = require("dotenv");

// dotenv.config({ path: "backend / config / config.env" });

const connectDb = ()=>{
    mongoose.connect(process.env.CONN_STR, { useNewUrlParser: true }).then(() => {
        console.log("Database Connected Successfully");
    }).catch((err) => {
        console.log("Something went wrong", err);
    });
}

module.exports = connectDb;
