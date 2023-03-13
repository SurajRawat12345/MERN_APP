import userModel from '../models/userModel.js'
import { comparePassword, hashPassword } from './../helpers/authHelper.js';
import JWT from 'jsonwebtoken';
import orderModel from '../models/orderModel.js';
import productModel from '../models/productModel.js'

// ----------------------- SIGNUP OR REGISTER ---------------------------
export const registerController = async(req,res) => {
    try{
        const { name , email , password , phone , address , answer} = req.body;
        if(!name){
            return res.send({message : "Name is required"})
        }
        if(!email){
            return res.send({message : "Email is required"})
        }
        if(!password){
            return res.send({message : "password is required"})
        }
        if(!phone){
            return res.send({message : "Phone is required"})
        }
        if(!address){
            return res.send({message : "Address is required"})
        }
        if(!answer){
            return res.send({message : "Answer is required"})
        }

        // Check an Existing user
        const existingUser = await userModel.findOne({email})
        if(existingUser){
            return res.status(200).send({
                success : false,
                message : "Already Registered please login",
            })
        }
        // Registering user
        const hashedPassword = await hashPassword(password);
        //save
        const user = await new userModel({name,email,phone,address,password:hashedPassword , answer}).save()
        res.status(201).send({
            success : true,
            message : "User Registered successfully",
            user
        })
    }
    catch(error){
        res.status(500).send({
            success : false,
            message : "Error in registration",
            error
        })
    }
}

// --------------------------- LOGIN ---------------------------------
export const loginController = async(req,res) => {
    try{
        const {email , password} = req.body;
        // validation
        if(!email || !password){
            return res.status(404).send({
                success : false,
                message : "Invalid login credentials"
            })
        }
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(404).send({
                success : false,
                message : "Email is not registered"
            })
        }
        const match = await comparePassword(password , user.password)
        if(!match){
            return res.send({
                success : false,
                message : "Invalid password"
            })
        };
        // token creation
        const token = await JWT.sign({ _id : user._id} , process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(200).send({
            success : true,
            message : "login successfully",
            user : {
                _id : user._id,
                name : user.name,
                email : user.email,
                phone : user.phone,
                address : user.address,
                role : user.role,
            },
            token,
        })
    }
    catch(error){
        res.status(500).send({
            success : false,
            message : "Error in login",
            error
        })
    }
}

// forgot password controller
export const forgotPasswordController = async(req,res) => {
    try{
        const {email , answer , newPassword} = req.body;
        if(!email){
            res.status(400).send({message : "Email is required"})
        }
        if(!answer){
            res.status(400).send({message : "answer is required"})
        }
        if(!newPassword){
            res.status(400).send({message : "New Password is required"})
        }
        // check
        const user = await userModel.findOne({email,answer})
        //validation
        if(!user){
            res.status(404).send({
                success : false,
                message : "Wrong email or answer"
            })
        }
        const hashed = await hashPassword(newPassword)
        await userModel.findByIdAndUpdate(user._id , {password : hashed})
        res.status(200).send({
            success : true,
            message : "Password Reset Successfully"
        })
    }
    catch(error){
        res.status(500).send({
            success : false,
            message : "Something went wrong",
            error
        })
    }
}

//test Controller
export const testController = (req,res) => {
    res.send({message : 'Protected Routes'})
}

// Update profile function
export const updateProfileController = async(req,res) => {
    try{
        const {name , email , password , address , phone} = req.body;
        const user = await userModel.findById(req.user._id);
        //password
        if(password && password.length < 6){
            return res.json({ error : "password is required and 6 character long"}) 
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updatedUser = await userModel.findByIdAndUpdate(req.user._id , {
            name : name || user.name,
            password : hashedPassword || user.password,
            phone : phone || user.phone,
            address : address || user.address
        } , {new: true})
        res.status(200).send({
            success : true,
            message : "User Profile updated successfully",
            updatedUser,
        })
    }
    catch(error){
        res.status(400).send({
            success : false,
            message : "Something went wrong",
            error,
        })
    }
}

// For placing Order
export const placeOrderController = async(req,res) => {
    try{
        const  { cart }  = req.body
        const order = await new orderModel({ products: cart, buyer: req.user._id,}).save();
        res.status(200).send({
            success : true,
            message : "Ordered Items in cart",
            order,
        });  
    }
    catch(error){
        res.status(400).send({
            success : false,
            message : "Error while ordering",
            error,
        })
    }
}

// Ordered product data by _id
export const getProductOrdersController = async(req,res) => {
    try{
        const orderedProduct = await productModel.findOne({_id : req.params.id})
        .select("-photo");
        res.send({
            success : true,
            message : "Successfully getted product",
            orderedProduct,
        })
    }
    catch(error){
        res.status(500).send({
            success : false,
            message : "Something went wrong",
            error,
        })
    }
}

// orders for user
export const getOrdersController = async(req,res) => {
    try{
        const orders = await orderModel.find({buyer:  req.user._id})
            .populate("buyer" , "name");
        res.json(orders);    
    }
    catch(error){
        res.status(500).send({
            success : false,
            message : "Something went wrong",
            error,
        })
    }
}
export const getAllOrdersController = async(req,res) => {
    try{
        const orders = await orderModel.find({})
            .populate("buyer" , "name")
            .sort({createdAt : -1});
        res.json(orders);    
    }
    catch(error){
        res.status(500).send({
            success : false,
            message : "Error while getting orders",
            error,
        })
    }
}
export const orderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const orders = await orderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );
        res.json(orders);
    } 
    catch (error) {
        res.status(500).send({
            success: false,
            message: "Error While Updateing Order",
            error,
        });
    }
  };