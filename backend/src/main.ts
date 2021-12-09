import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "./config/config.service";
import { OgmaService } from "@ogma/nestjs-module";
import { configure } from "./config.main";
import { goSpelunking } from "./spelunk";
import session = require("express-session");
import * as passport from "passport";

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

  // Session configuration
  app.use(
    session({
      secret: config.sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        // secure: true,
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      },
      /*store: new MongoStore({
          uri: process.env.DATABASE_URL,
          collection: 'sessions',
        }),*/
    })
  );

  // Passport initialization
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(port);
  logger.log(`Listening at ${await app.getUrl()}`, "NestApplication");
}
bootstrap();
