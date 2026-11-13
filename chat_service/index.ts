import dotenv from "dotenv";
import app from "./app.js";
import dbConnection from "./db/config.js";

//configure the use of environment variables
dotenv.config();

const port = process.env.PORT;

dbConnection();

app.listen(port, () => {
    console.log(`🚀 Rest server listening on ${port}`);
});
