import express from "express";
import userRoutes from "./routes/usersRoutes.js";
import healthRoute from "./routes/healthRoutes.js";

const app = express();

app.use(express.json());

app.use("/health", healthRoute);
app.use("/api/users", userRoutes);

export default app;
