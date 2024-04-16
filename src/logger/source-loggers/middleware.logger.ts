import { logger } from "@/logger/logger";
import { Meta } from "@/logger/types";

const createMeta = (meta: Meta) => ({
  source: "MiddlewareLogger",
  meta: {
    from: meta.request.from ? meta.request.from : "Anauthorized",
    ...meta,
  },
});

class MiddlewareLogger {
  private readonly logger;
  constructor() {
    this.logger = logger;
  }

  info(message: string, meta: Meta) {
    this.logger.info(message, createMeta(meta));
  }
}

export const middlewareLogger = new MiddlewareLogger();
