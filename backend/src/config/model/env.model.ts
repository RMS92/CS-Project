import { t } from "@deepkit/type";

export class EnvConfig {
  @t
  NODE_ENV: "production" | "prod" | "development" | "dev" | "test" =
    "development";

  @t
  DATABASE_URL: string = "postgres://postgres:root@localhost:5432/cs_project";

  @t
  DATABASE_RECORDS_URL: string =
    "postgres://postgres:root@localhost:5432/cs_project_records";

  @t
  JWT_SECRET: string = "itsasecret";

  @t
  SESSION_SECRET: string = "itsasecret";

  @t
  PORT: number = 3333;

  @t
  COOKIE_AGE: number = 86400;

  @t
  APPLICATION: string = "cs-project";

  @t
  GLOBAL_PREFIX: string = "api";

  @t
  GOOGLE_PROMPT: string = "select_account";

  @t
  GOOGLE_RESPONSE_TYPE: string = "code";

  @t
  GOOGLE_SCOPE: string = "email profile";

  @t
  GOOGLE_STATE: string = "some_state_token";
}
