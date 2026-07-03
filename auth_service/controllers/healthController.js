import getDbStatus from "../db/status.js";

const healthCheck = (req, res) => {
    const database = getDbStatus();

    res.status(database.isConnected ? 200 : 503).json({
        service: "auth_service",
        status: database.isConnected ? "ok" : "degraded",
        database: database.label,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
};

export { healthCheck };
