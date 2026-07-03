import express from "express";
import dotenv from "dotenv";
import dbConnection from "./db/config.js";
import userRoutes from "./routes/usersRoutes.js";
import healthRoute from "./routes/healthRoutes.js";

//configure the use of environment variables
dotenv.config();

const app = express();
app.use(express.json());

const port = process.env.PORT;
const healthRoutePath = "/health";
const usersRoutePath = "/api/users";

dbConnection();

app.use(healthRoutePath, healthRoute);
app.use(usersRoutePath, userRoutes);

app.listen(port, () => {
    console.log(`🚀 Rest server listening on ${port}`);
});
