import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "./config/config.service";
import { OgmaService } from "@ogma/nestjs-module";
import { configure } from "./config.main";
import { goSpelunking } from "./spelunk";
import session = require("express-session");
import * as passport from "passport";
let cookieparser = require("cookie-parser");

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    process.env.NODE_ENV === "production" ? { logger: false } : {}
  );

  const corsOptions = {
    origin: ["http://localhost:3000"],
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  };

  const config = app.get<ConfigService>(ConfigService);
  const logger = app.get<OgmaService>(OgmaService);
  app.useLogger(logger);
  const port = config.port;
  configure(app, config, logger);
  await goSpelunking(app);
  app.use(cookieparser());

  // Session configuration
  app.use(
    session({
      secret: config.sessionSecret,
      resave: true,
      saveUninitialized: true,
      cookie: {
        // secure: true,
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      },
      /*store: new PostgreSqlStore({
        conString: config.databaseUrl,
      }),*/
    })
  );

  // Passport initialization
  app.use(passport.initialize());
  app.use(passport.session());

  // Cross-origin resource sharing
  app.enableCors(corsOptions);

  await app.listen(port);
  logger.log(`Listening at ${await app.getUrl()}`, "NestApplication");
}
bootstrap();
