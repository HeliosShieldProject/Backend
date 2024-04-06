import { format } from "logform";

export const rename = format((info, opts) => {
  for (const key in opts.keys) {
    if (info[key]) {
      info[opts.keys[key]] = info[key];
      delete info[key];
    }
  }
  return info;
});