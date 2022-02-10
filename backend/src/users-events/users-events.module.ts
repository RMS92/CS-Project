import { Module } from "@nestjs/common";
import { UsersEventsService } from "./users-events.service";
import { DatabaseModule } from "../database/database.module";
import { ConfigModule } from "../config/config.module";

@Module({
  imports: [
    DatabaseModule.forFeature({ tableName: "user_event" }),
    ConfigModule.Deferred,
  ],
  controllers: [],
  providers: [UsersEventsService],
  exports: [UsersEventsService],
})
export class UsersEventsModule {}
