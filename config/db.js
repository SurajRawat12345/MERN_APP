import mongoose from 'mongoose';
import colors from 'colors';

// for deprication warning ........
mongoose.set('strictQuery', false); 

const connectDB = async() => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL , {useNewUrlParser : true , useUnifiedTopology : true})
    }
    catch(error){
        
    }
}
export default connectDB;