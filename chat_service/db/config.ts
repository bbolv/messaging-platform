import mongoose from "mongoose";

const dbConnection = async (): Promise<void> => {
    const MONGO_HOST = process.env.MONGO_HOST;
    const MONGO_DB = "db_chat";

    const URI = `mongodb://${MONGO_HOST}/${MONGO_DB}`;

    try {
        await mongoose.connect(URI);
    } catch (error) {
        console.log(error);
        throw new Error("Error with the db");
    }
};

export default dbConnection;
