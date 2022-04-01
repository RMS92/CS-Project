import { Module } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { NotificationsController } from "./notifications.controller";
import { DatabaseModule } from "../database/database.module";
import { ConfigModule } from "../config/config.module";

@Module({
  imports: [
    DatabaseModule.forFeature({ tableName: "notification" }),
    ConfigModule.Deferred,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
