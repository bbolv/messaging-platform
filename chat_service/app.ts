import express from "express";
import chatRoutes from "./routes/chatsRoutes.js";
import healthRoute from "./routes/healthRoutes.js";

const app = express();

app.use(express.json());

app.use("/health", healthRoute);
app.use("/api/chat", chatRoutes);

export default app;
