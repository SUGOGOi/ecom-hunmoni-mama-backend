import mongoose from "mongoose";
export const connectDB = async () => {
    try {
        // const { connection } = await mongoose.connect(
        //   `mongodb+srv://sumsum:sumsumgogoi@cluster0.5sqlsyx.mongodb.net/ecom_hunmoni?retryWrites=true&w=majority&appName=Cluster0`
        // );
        const { connection } = await mongoose.connect(`${process.env.MONGO_LOCAL}`);
        console.log(`Mongodb connected ${connection.host}`);
    }
    catch (error) {
        console.log(error);
    }
};
