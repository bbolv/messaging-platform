import mongoose from "mongoose";

const dbConnection = () => {
    const MONGO_HOST = process.env.MONGO_HOST;
    const MONGO_DB = "db_users";

    const URI = `mongodb://${MONGO_HOST}/${MONGO_DB}`;

    try {
        mongoose.connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    } catch (error) {
        console.log(error);
        throw new Error("Error with the db");
    }
};

export default dbConnection;
