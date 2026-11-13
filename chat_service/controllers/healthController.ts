import type { RequestHandler } from "express";
import getDbStatus from "../db/status.js";

const healthCheck: RequestHandler = (req, res) => {
    const database = getDbStatus();

    res.status(database.isConnected ? 200 : 503).json({
        service: "chat_service",
        status: database.isConnected ? "ok" : "degraded",
        database: database.label,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
};

export { healthCheck };
