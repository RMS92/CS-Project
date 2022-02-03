import { ModuleConfigFactory } from "@golevelup/nestjs-modules";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "../config/config.service";
import { DatabaseModuleOptions } from "../database/interfaces/database-options.interface";

@Injectable()
export class DatabaseRecordsModuleConfig
  implements ModuleConfigFactory<DatabaseModuleOptions>
{
  constructor(private readonly configService: ConfigService) {}

  createModuleConfig(): DatabaseModuleOptions {
    return this.configService.databaseRecordsConfig;
  }
}
