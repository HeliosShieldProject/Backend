import { Injectable, Logger, NestMiddleware } from "@nestjs/common";

import { NextFunction, Request, Response } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: Logger) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const { originalUrl, body, method, headers } = request;
    const userAgent = request.get("user-agent") || "";

    response.on("finish", () => {
      const { statusCode } = response;

      this.logger.log(
        `${method} ${originalUrl} ${JSON.stringify(body)} ${JSON.stringify(headers)} - ${statusCode} - ${userAgent}`,
        "LoggerMiddleware",
      );
    });

    next();
  }
}
