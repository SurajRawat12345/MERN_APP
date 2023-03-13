import express from 'express';
const router = express.Router();

import { 
    registerController, 
    loginController, 
    testController, 
    forgotPasswordController,
    updateProfileController,
    getOrdersController,
    placeOrderController,
    getProductOrdersController,
    getAllOrdersController,
    orderStatusController
} from '../controllers/authController.js'; 
import { isAdmin , requireSignIn } from '../middlewares/authMiddleware.js';

/* ----------------- Routing ------------------ */

// FOR REGISTER POST
router.post('/register' , registerController);

// FOR LOGIN POST
router.post('/login' , loginController);

// Forgot password 
router.post('/forgot-password',forgotPasswordController);

// Test Route
router.get('/test' ,requireSignIn, isAdmin, testController);

// protected user route auth
router.get('/user-auth' , requireSignIn , (req,res) => {
    res.status(200).send({ok : true});
});
// protected admin route auth 
router.get('/admin-auth' , requireSignIn , isAdmin , (req,res) => {
    res.status(200).send({ok : true});
});

// Update profile
router.put('/profile' , requireSignIn , updateProfileController);

// Place Order
router.post('/place-order',requireSignIn , placeOrderController);

// orders
router.get('/orders' , requireSignIn , getOrdersController);

// get Ordered product
router.get('/ordered-product/:id' , requireSignIn , getProductOrdersController);

// All orders for admin
router.get('/all-orders',requireSignIn , isAdmin , getAllOrdersController);

// Update status
router.put('/order-status/:orderId', requireSignIn, isAdmin, orderStatusController);

export default router;