import { Module } from "@nestjs/common";
import { EventsService } from "./events.service";
import { EventsController } from "./events.controller";
import { DatabaseModule } from "../database/database.module";
import { UsersEventsModule } from "../users-events/users-events.module";
import { ConfigModule } from "../config/config.module";
import { NotificationsModule } from "../notifications/notifications.module";

@Module({
  imports: [
    DatabaseModule.forFeature({ tableName: "event" }),
    UsersEventsModule,
    NotificationsModule,
    ConfigModule.Deferred,
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
