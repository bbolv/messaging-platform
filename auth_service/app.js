import express from "express";
import expressWinston from "express-winston";
import { transports, format } from "winston";
import healthRoute from "./routes/healthRoutes.js";

const createApp = ({ userRoutes } = {}) => {
    const app = express();

    app.use(express.json());

    app.use("/health", healthRoute);

    if (userRoutes) {
        app.use("/api/auth", userRoutes);
    }

    app.use(
        expressWinston.logger({
            transports: [new transports.Console()],
            format: format.combine(
                format.json(),
                format.timestamp(),
                format.prettyPrint()
            )
        })
    );

    return app;
};

export default createApp;
