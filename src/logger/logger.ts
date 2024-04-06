import { env } from "@/config/env";
import { consoleTransport, mongoTransport } from "./transports";
import { createLogger, format } from "winston";
import { rename, server } from "./formats";

const getTransports = () => {
  const transports = {
    development: [consoleTransport, mongoTransport],
    production: [mongoTransport],
  };

  return transports[env.NODE_ENV];
};

const instanceLogger = {
  format: format.combine(
    server({ name: "Master Backend" }),
    rename({
      keys: {
        context: "source",
      },
    }),
  ),
  transports: getTransports(),
};

export const logger = createLogger(instanceLogger);
