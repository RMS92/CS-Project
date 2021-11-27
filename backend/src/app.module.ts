import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./database/database.module";
import { ConfigModule } from "./config/config.module";
import {
  ConfigModuleConfig,
  DatabaseModuleConfig,
  OgmaModuleConfig,
} from "./options";
import { OgmaModule } from "@ogma/nestjs-module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRootAsync(ConfigModule, {
      useClass: ConfigModuleConfig,
    }),
    DatabaseModule.forRootAsync({
      imports: [ConfigModule.Deferred],
      useClass: DatabaseModuleConfig,
    }),
    OgmaModule.forRootAsync({
      useClass: OgmaModuleConfig,
      imports: [ConfigModule.Deferred],
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
