import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "./config/config.service";
import { OgmaService } from "@ogma/nestjs-module";
import { configure } from "./config.main";
import { goSpelunking } from "./spelunk";

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    process.env.NODE_ENV === "production" ? { logger: false } : {}
  );
  const config = app.get<ConfigService>(ConfigService);
  const logger = app.get<OgmaService>(OgmaService);
  app.useLogger(logger);
  const port = config.port;
  configure(app, config, logger);
  await goSpelunking(app);
  await app.listen(port);
  logger.log(`Listening at ${await app.getUrl()}`, "NestApplication");
}
bootstrap();
