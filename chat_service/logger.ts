import { createLogger, format, transports } from "winston";

const isProduction = process.env.NODE_ENV === "production";

const logger = createLogger({
    level: process.env.LOG_LEVEL,
    defaultMeta: { service: "chat_service" },
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        isProduction
            ? format.json()
            : format.combine(
                  format.colorize(),
                  format.printf(({ timestamp, level, message, stack }) => {
                      return `${timestamp} ${level}: ${stack ?? message}`;
                  })
              )
    ),
    transports: [new transports.Console()]
});

export default logger;
