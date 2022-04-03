import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "./config/config.service";
import { OgmaService } from "@ogma/nestjs-module";
import { configure } from "./config.main";
import { goSpelunking } from "./spelunk";
import session = require("express-session");
import * as passport from "passport";
let cookieparser = require("cookie-parser");
const fs = require("fs");

async function bootstrap() {
  /*const httpsOptions = {
    key: fs.readFileSync("/etc/letsencrypt/live/cs-event.fr/privkey.pem"),
    cert: fs.readFileSync("/etc/letsencrypt/live/cs-event.fr/cert.pem"),
  };*/

  const app = await NestFactory.create(
    AppModule
    //{httpsOptions}
  );

  const corsOptions = {
    origin: [
      "http://localhost:3000",
      "http://localhost",
      "https://cs-event.fr:3000",
      "https://cs-event.fr",
      // "http://cs-event.fr:3000",
      // "http://cs-event.fr",
    ],
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
      resave: false,
      saveUninitialized: false,
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
