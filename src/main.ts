import { AppModule } from "@/app.module";
import { env } from "@/config/env";
import { instance } from "@/logger/winson.logger";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { WinstonModule } from "nest-winston";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: instance,
    }),
  });
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle("Helios Master Backend")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(env.MASTER_BACKEND_PORT);
}
bootstrap();
