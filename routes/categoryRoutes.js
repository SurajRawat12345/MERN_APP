import express from 'express';
import { isAdmin, requireSignIn } from './../middlewares/authMiddleware.js';
import { 
    createCategoryController , 
    updateCategoryController , 
    categoryController , 
    singleCategoryController,
    deleteCategory 
} from './../controllers/categoryController.js';

const router = express.Router();

/* -------------------- routes ------------------------- */

// CREATE CATEGORY 
router.post('/create-category', requireSignIn , isAdmin , createCategoryController);

// UPDATE CATEGORY
router.put('/update-category/:id', requireSignIn, isAdmin , updateCategoryController);

// GETALL CATEGORY
router.get('/get-category' , categoryController);

// GET SINGLE CATEGORY
router.get('/single-category/:slug', singleCategoryController);

// DELETE CATEGORY
router.delete('/delete-category/:id', requireSignIn , isAdmin , deleteCategory);

export default router ;