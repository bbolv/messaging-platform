import dotenv from "dotenv";
import createApp from "./app.js";
import dbConnection from "./db/config.js";
import userRoutes from "./routes/usersRoutes.js";

//configure the use of environment variables
dotenv.config();

const port = process.env.PORT;
const app = createApp({ userRoutes });

dbConnection();

app.listen(port, () => {
    console.log(`🚀 Rest server listening on ${port}`);
});
