import { jsonSerializer } from "@deepkit/type";
import { Inject, Injectable } from "@nestjs/common";
import { parse } from "dotenv";
import { readFileSync } from "fs";
import { join } from "path";
import { DatabaseModuleOptions } from "../database/interfaces/database-options.interface";
import { CONFIG_MODULE_OPTIONS } from "./config.constants";
import { ConfigModuleOptions } from "./interfaces/config-options.interface";
import { EnvConfig } from "./model/env.model";
import { OgmaModuleOptions } from "@ogma/nestjs-module";

@Injectable()
export class ConfigService {
  private envConfig: EnvConfig;

  constructor(
    @Inject(CONFIG_MODULE_OPTIONS)
    options: ConfigModuleOptions
  ) {
    if (!options.useProcess && !options.fileName) {
      throw new Error(
        "Missing configuration options." +
          ' If using process.env variables, please mark useProcess as "true".' +
          " Otherwise, please provide and env file."
      );
    }
    let config: { [key: string]: any };
    if (options.fileName && !options.useProcess) {
      config = parse(readFileSync(join(process.env.PWD, options.fileName)));
    } else {
      config = process.env;
    }
    this.envConfig = this.validateConfig(config);
  }

  private validateConfig(config: Record<string, any>): EnvConfig {
    try {
      return jsonSerializer.for(EnvConfig).validatedDeserialize(config);
    } catch (err) {
      throw new Error(
        err.errors.map((err: Error) => JSON.stringify(err)).join(" ")
      );
    }
  }

  get databaseUrl(): string {
    return this.envConfig.DATABASE_URL;
  }

  get databaseRecordsUrl(): string {
    return this.envConfig.DATABASE_RECORDS_URL;
  }

  get isProd(): boolean {
    const env = this.nodeEnv.toLowerCase();
    return env === "production" || env === "prod";
  }

  get databaseConfig(): DatabaseModuleOptions {
    return {
      connectionUrl: this.databaseUrl,
      ssl: this.isProd,
    };
  }

  get databaseRecordsConfig(): DatabaseModuleOptions {
    return {
      connectionUrl: this.databaseRecordsUrl,
      ssl: this.isProd,
    };
  }

  get nodeEnv(): string {
    return this.envConfig.NODE_ENV;
  }

  get globalPrefix(): string {
    return this.envConfig.GLOBAL_PREFIX;
  }

  get port(): number {
    return this.envConfig.PORT;
  }

  getSecurityLevel(): number {
    return this.envConfig.SECURITY_LEVEL;
  }

  get sessionSecret(): string {
    return this.envConfig.SESSION_SECRET;
  }

  get applicationName(): string {
    return this.envConfig.APPLICATION;
  }

  get ogmaConfig(): Pick<OgmaModuleOptions, "service"> {
    return {
      service: {
        json: this.isProd,
        color: !this.isProd,
        application: this.applicationName,
      },
    };
  }
}
