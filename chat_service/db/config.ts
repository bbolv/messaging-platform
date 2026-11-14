import mongoose from "mongoose";

const dbConnection = async (): Promise<void> => {
    const MONGO_HOST = process.env.MONGO_HOST;
    const MONGO_DB = "db_chat";

    const URI = `mongodb://${MONGO_HOST}/${MONGO_DB}`;

    await mongoose.connect(URI);
};

export default dbConnection;
