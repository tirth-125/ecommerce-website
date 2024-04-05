const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Product name"]
    },
    description: {
        type: String,
        required: [true, "Please Enter Your Product description"]
    },
    price: {
        type: Number,
        required: [true, "Please Enter Your Product price"],
        maxLength: [8, "Price cannot exceed 8 characters"]
    },
    rating: {
        type: Number,
        default: 0
    },
    images: [{
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }],
    category: {
        type: String,
        required: [true, "Please Enter Your Product category"]
    },
    stock: {
        type: Number,
        required: [true, "Please Enter Your Product stock"],
        maxLength: [6, "Stock cannot exceed 6 digit length"],
        default: 1
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [{
        name: {
            type: String,
            required: [true, "Please Enter Your Product name"]
        },
        rating : {
            type : Number,
            required : true
        },
        Comment : {
            type : Number,
            required : true
        }

    }],
    createdAt:{
        type :Date,
        default : Date.now()
    }
});

module.exports = mongoose.model("Product", productSchema);