import express from "express";
import dotenv from "dotenv";
import dbConnection from "./db/config.js";
import chatRoutes from "./routes/chatsRoutes.js";
import healthRoute from "./routes/healthRoutes.js";

//configure the use of environment variables
dotenv.config();

const app = express();
app.use(express.json());

const port = process.env.PORT;
const chatRoutePath = "/api/chat";
const healthRoutePath = "/health";

dbConnection();

app.use(healthRoutePath, healthRoute);
app.use(chatRoutePath, chatRoutes);

// app.get('/', (req,res) => {
//     res.send('Hello world from chat server');
// })

app.listen(port, () => {
    console.log(`🚀 Rest server listening on ${port}`);
});
