import { InfoParams } from "@/logger/types";
import { format } from "logform";

interface ServerFormatOptions {
  name: string;
}

export const server = format((info: InfoParams, opts: ServerFormatOptions) => {
  info.server = opts.name;
  return info;
});
