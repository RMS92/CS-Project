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
import { AuthModule } from "./auth/auth.module";
import { PassportModule } from "@nestjs/passport";
import { SecurityModule } from "./security/security.module";
import { IAuthModuleOptions } from "@nestjs/passport/dist/interfaces/auth-module.options";
import { EventsModule } from "./events/events.module";
import { UsersEventsModule } from './users-events/users-events.module';
import { CommentsModule } from './comments/comments.module';

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
    PassportModule.registerAsync({
      useFactory: async () => {
        return {
          session: true,
        };
      },
    }),
    UsersModule,
    EventsModule,
    AuthModule,
    SecurityModule,
    UsersEventsModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
