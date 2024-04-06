import { middlewareLogger } from "@/logger/source-loggers/middleware.logger";
import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  @Inject()
  private readonly jwtService: JwtService;

  use(request: Request, response: Response, next: NextFunction): void {
    const { password, ...body } = request.body;
    const auth = request.headers.authorization?.split(" ")[1];
    const from = this.jwtService.decode(auth);

    middlewareLogger.info(
      `${request.method} Request to ${request.originalUrl}`,
      {
        request: {
          originalUrl: request.originalUrl,
          body,
          method: request.method,
          headers: request.headers,
          from: from,
        },
        response: {
          statusCode: response.statusCode,
        },
      },
    );
    next();
  }
}
