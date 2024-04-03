import { createLogger, format, transports } from "winston";

const devLogger = {
  format: format.combine(
    format.json(),
    // format.prettyPrint(),
    format.colorize({ all: true}),
    format.timestamp(),
    format.errors({ stack: true }),
  ),
  transports: [new transports.Console()],
};

const prodLogger = {
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json(),
  ),
  transports: [
    new transports.File({
      filename: "combine.log",
      level: "info",
    }),
  ],
};

const instanceLogger =
  process.env.NODE_ENV === "production" ? prodLogger : devLogger;

export const instance = createLogger(instanceLogger);
