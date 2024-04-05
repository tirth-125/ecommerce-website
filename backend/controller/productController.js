const Product = require("../model/productModel");
const ErrorHandler = require("../utils/errorHandler");
const asyncHandler = require("../middleware/asyncErrorhandler"); // async error handling
const ApiFeatures = require("../utils/apifeatures");
// CREATE PRODUCT
exports.createProduct = asyncHandler(async (req, res) => {
    const newProduct = await Product.create(req.body);
    res.status(200).json({
        success: true,
        data: {
            newProduct
        }
    });

});
// GET ALL PRODUCT
exports.getAllproduct = asyncHandler(async (req, res) => {
    let resultPerPage = 5;
    const apiFeature =  new ApiFeatures(Product.find(),req.query)
    .search()
    .Filter()
    .Pagination(resultPerPage);

    const product = await apiFeature.query; 
    res.status(200).json({
        success: true,
        length: product.length,
        data: {
            product
        }
    });

});
// GET SINGAL PRODUCT
exports.getProductdetails = asyncHandler(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }
    res.status(200).json({
        success: true,
        product
    })
});

// UPDATE THE PRODUCT
exports.updateProduct = asyncHandler(async (req, res, next) => {

    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(201).json({
        success: true,
        message: " Product Update Successfully",
        data: {
            product
        }
    });

});
// DELETE PRODUCT

exports.deleteProduct = asyncHandler(async (req, res, next) => {

    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }
    product = await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        memssage: "product Deleted Successfully"
    }) 
});    