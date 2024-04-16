import { env, type NODE_ENV } from "@/config/env";

import { createLogger, format } from "winston";
import TransportStream from "winston-transport";
import { rename, server } from "./formats";
import {
  consoleTransport,
  logtailTransport,
  mongoTransport,
} from "./transports";

const getTransports = (): TransportStream[] => {
  const transports: Record<NODE_ENV, TransportStream[]> = {
    development: [consoleTransport, mongoTransport],
    production: [mongoTransport, logtailTransport],
    test: [],
  };

  return transports[env.NODE_ENV];
};

export const logger = createLogger({
  format: format.combine(
    server({ name: "Master Backend" }),
    rename({
      keys: {
        context: "source",
      },
    }),
  ),
  transports: getTransports(),
});
