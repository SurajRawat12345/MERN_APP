import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js"
import fs from 'fs';
import slugify from "slugify";

export const createProductController = async(req,res) => {
    try{
        const { name , slug , description , price , category , quantity , shipping} = req.fields;
        const {photo} = req.files;  
        // Validation
        switch(true){
            case !name : 
                return res.status(500).send({ error : " Name is required"});
            case !description : 
                return res.status(500).send({ error : " Description is required"});
            case !price : 
                return res.status(500).send({ error : " Price is required"});
            case !category : 
                return res.status(500).send({ error : " Category is required"});
            case !quantity : 
                return res.status(500).send({ error : " quantity is required"});
            case photo && photo.size > 10000:
                return res.status(500).send({ error : "Photo is required and should be less than 1mb"})
        }

        const products = await productModel({...req.fields,slug : slugify(name)})
        if(photo){
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        } 
        await products.save();
        res.status(200).send({
            success: true,
            message : "Product created Successfully",
            products,
        })
    }
    catch(error){
        res.status(500).send({
            success : false,
            message : "Error in creating Product",
            error,
        })
    }
}
export const getProductController = async(req,res) => {
    try{
        const products = await productModel
        .find({})
        .populate('category')
        .select("-photo")
        .limit(12)
        .sort({createdAt: -1});
        res.status(200).send({
            success: true,
            totalCount : products.length,
            message: "All Products",
            products, 
        })
    }
    catch(error){
        res.status(500).send({
            success : false,
            message : "Error in Displaying Product",
            error,
        })
    }
}
export const singleProductController = async(req,res) => {
    try{
        const product = await productModel
        .findOne({slug : req.params.slug})
        .select("-photo")
        .populate('category')
        res.status(200).send({
            success : true,
            message : "Get Single Product Successfully",
            product,
        });
    }
    catch(error){
        res.status(500).send({
            success : false,
            error,
            message : "Error while getting Single product",
        })
    }
}

// GET PHOTO
export const productPhotoController = async(req,res) => {
    try{
        const product = await productModel.findById(req.params.pid).select("photo")
        if(product.photo.data){
            res.set('Content-type',product.photo.contentType)
            return res.status(200).send(product.photo.data);
        }

    }
    catch(error){
        res.status(500).send({
            success : false,
            error,
            message : "Error while getting product photos",
        })
    }
} 
export const deleteProductController = async(req,res) => {
    try{
        const {pid} = req.params;
        await productModel.findByIdAndDelete(pid).select("-photo");
        res.status(200).send({
            success : true,
            message : "deleted Product Successfully",
        });
    }
    catch(error){
        res.status(500).send({
            success : false,
            error,
            message : "Error while deleting product",
        })
    }
}   
export const updateProductController = async(req,res) => {
    try{
        const { name , slug , description , price , category , quantity , shipping} = req.fields;
        const {photo} = req.files;  
        // Validation
        switch(true){
            case !name : 
                return res.status(500).send({ error : " Name is required"});
            case !description : 
                return res.status(500).send({ error : " Description is required"});
            case !price : 
                return res.status(500).send({ error : " Price is required"});
            case !category : 
                return res.status(500).send({ error : " Category is required"});
            case !quantity : 
                return res.status(500).send({ error : " quantity is required"});
            case photo && photo.size > 10000:
                return res.status(500).send({ error : "Photo is required and should be less than 1mb"})
        }

        const products = await productModel.findByIdAndUpdate(req.params.pid ,
            {...req.fields, slug : slugify(name)},{new : true}
        );
        if(photo){
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        } 
        await products.save();
        res.status(201).send({
            success: true,
            message : "Product updated Successfully",
            products,
        })
    }
    catch(error){
        res.status(500).send({
            success : false,
            message : "Error in updating Product",
            error,
        })
    }
}

export const productFiltersController = async(req,res) => { 
    try{
        const {checked , radio} = req.body;
        let args = {}
        if(checked.length > 0){
            args.category = checked;
        }
        if(radio.length > 0){
            args.price = { $gte: radio[0] , $lte: radio[1]}
        }     
        const products = await productModel.find(args);
        res.status(200).send({
            success: true,
            products,
        }); 
    }
    catch(error){
        res.status(500).send({
            success : false,
            message : "Error while filtering  Products",
            error,
        })
    }
}
export const productCountConroller = async(req,res) => {
    try{
        const total = await productModel.find({}).estimatedDocumentCount();
        res.status(200).send({
            success : true,
            total,
        });
    }
    catch(error){
        res.status(500).send({
            success : false,
            message : "Error while loading Products",
            error,
        })
    }
}

//product list based on page
export const productListController = async(req,res) => {
    try{
        const perPage = 6;
        const page = req.params.page ? (req.params.page) : (1)
        const products = await productModel.find({})
        .select("-photo")
        .skip((page-1)*perPage)
        .limit(perPage)
        .sort({createdAt : -1});
        res.status(200).send({
            success : true,
            products,
        })
    }
    catch(error){
        res.status(400).send({
            success : false,
            message : "Error in per page Products",
            error,
        })
    }
}
export const searchProductController = async(req,res) => {
    try{
        const {keyword} = req.params;
        const results = await productModel.find({
            $or:[
                {name: { $regex : keyword , $options : 'i'}},
                { description : { $regex : keyword , $options : 'i' }}, 
            ],
        })
        .select("-photo");
        res.json(results);
    }
    catch(error){
        res.status(400).send({
            success : false,
            message : "Error while searching Products",
            error,
        })
    }
}

export const similarProductController = async(req,res) => {
    try{
        const {pid,cid} = req.params;
        const products = await productModel.find({
            category : cid,
            _id : {$ne : pid},
        })
        .select("-photo").limit(3)
        .populate("category");
        res.status(200).send({
            success : true,
            products,
        })
    }
    catch(error){
        res.status(400).send({
            success : false,
            message : "Error while searching Products",
            error,
        })
    }
}
// get Product by Category
export const productCategoryController = async(req,res) => {
    try{
        const category = await categoryModel.findOne({ slug : req.params.slug })
        const products = await productModel.find({category}).populate('category')
        res.status(200).send({
            success : true,
            category ,
            products, 
        })
    }
    catch(error){
        res.status(400).send({
            success : false,
            message : "Error while Displaying Products according to category",
            error,
        })
    }
}