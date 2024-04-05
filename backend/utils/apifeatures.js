const { json } = require("express");

class ApiFeatures {
    // Ex:- tarike, query == find method 
    // queryStr == req.params for searching
    constructor(query,queryStr){
        this.query = query,
        this.queryStr = queryStr
    }

    search(){                                   
        const keyword = this.queryStr.keyword ? {name : {$regex: this.queryStr.keyword,$options :"i"}}:{}// ternary operator (i means case insensitive)
        // console.log(keyword);
        this.query = this.query.find({...keyword});
        return this; // returns the current instance of the class.
    }

    Filter(){
        const queryCopy = {...this.queryStr}; //use sperad operator only take property from objects
        //  Removing Some fields for category
        const removeFileds = ["keyword","page","limit"];
        // console.log(queryCopy);
        removeFileds.forEach((key)=>delete queryCopy[key]);
        // console.log(queryCopy);

        // Filter For Price and Rating
        // console.log(queryCopy); this object take only gt|lt etc but i want to $gt|$lt so covet into string
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,(key)=> `$${key}`);
        // console.log(queryStr);
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    Pagination(resultPerPage){
        const currentPage = (this.queryStr.page) || 1;
        const skip = resultPerPage*(currentPage - 1);

        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    };
}

module.exports = ApiFeatures;