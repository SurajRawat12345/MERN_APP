import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        products : [
            {
                type : mongoose.ObjectId,
                ref : 'products',
            },
        ],    
        buyer : {
            type : mongoose.ObjectId,
            ref : 'users',
        },
        status: {
            type: String,
            default: "Not_Process",
            enum: ["Not_Process", "Processing", "Shipped", "deliverd", "cancel"],
        },
    },
    {timestamps : true}
);
export default mongoose.model("order",orderSchema);