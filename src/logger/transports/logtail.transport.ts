import { env } from "@/config/env";
import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";

export const logtailTransport = new LogtailTransport(
  new Logtail(env.LOGTAIL_SOURCE),
);
