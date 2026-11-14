import "dotenv/config";
import app from "./app.js";
import dbConnection from "./db/config.js";
import logger from "./logger.js";

const port = process.env.PORT;

try {
    await dbConnection();
    logger.info("MongoDB connected successfully");

    const server = app.listen(port, () => {
        logger.info(`REST server listening on ${port}`);
    });

    server.on("error", (error) => {
        logger.error(error);
        process.exitCode = 1;
    });
} catch (error) {
    logger.error(error instanceof Error ? error : new Error(String(error)));
    process.exitCode = 1;
}
