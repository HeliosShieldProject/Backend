import { InfoParams } from "@/logger/types";
import { colored } from "@/logger/utils";
import { format, transports } from "winston";

export const consoleTransport = new transports.Console({
  format: format.combine(
    format.timestamp({
      format: new Date().toLocaleString("ru-RU", {
        timeZone: "Europe/Moscow",
      }),
    }),
    format.printf((info: InfoParams) => {
      return `[${info.timestamp}] - [${info.source.padEnd(20)}] - [${colored(info.level)}] - ${info.message}`;
    }),
  ),
});
