import express from 'express';
import { isAdmin, requireSignIn } from './../middlewares/authMiddleware.js';
import { 
    createProductController,
    getProductController,
    singleProductController,
    productPhotoController,
    deleteProductController,
    updateProductController,
    productFiltersController,
    productCountConroller,
    productListController,
    searchProductController,
    similarProductController,
    productCategoryController,
} from './../controllers/productController.js';
import formidable from 'express-formidable';

const router = express.Router();

/* -------------------- routes ------------------------- */

// creating product
router.post('/create-product', requireSignIn , isAdmin , formidable(), createProductController);

// Displaying Products
router.get('/get-product' , getProductController);

// Displaying one product
router.get('/get-product/:slug' , singleProductController );

// get Photo
router.get('/product-photo/:pid' , productPhotoController);

// delete Product
router.delete('/delete-product/:pid', requireSignIn , isAdmin, deleteProductController)

// update Product
router.put('/update-product/:pid', requireSignIn , isAdmin , formidable(), updateProductController);

// Filter Product
router.post('/product-filters' , productFiltersController);

//product count
router.get('/product-count',productCountConroller);

//product per page
router.get('/product-list/:page',productListController);

// Seach product route
router.get('/search/:keyword',searchProductController);

// Similar product
router.get('/related-product/:pid/:cid' , similarProductController);

// Get Products by category
router.get('/product-category/:slug',productCategoryController);
export default router ;