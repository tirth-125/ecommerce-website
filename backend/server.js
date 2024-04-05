const mongoose = require("mongoose");
const app = require("./app");
const dotenv = require("dotenv");
const connectDb = require("./config/database");
// mongoose.connect(process.env.CONN_STR,{newurlparser:true,})

// Handling UncaughtException
process.on('uncaughtException',(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shuting down the server due to uncaughtException`);
    process.exit(1);
});
dotenv.config({path:"backend/config/config.env"});

connectDb();

const server = app.listen(process.env.PORT,()=>{
    console.log(`Sever is listen on http://localhost:${process.env.PORT}`);
});

// console.log(youtube); this is uncaughtException  

// Unhandeled Rejection like any error in connection string like mongodb instead of mong
// process.on("unhandeledRejection",(err)=>{
//     console.log(`Error: ${err.message}`);
//     console.log(`Shuting down the server due to unhandled promise rejection`);

//     server.close(()=>{
//         process.exit(1);
//     })
// })