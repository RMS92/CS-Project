import { Module } from "@nestjs/common";
import { UsersEventsService } from "./users-events.service";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [DatabaseModule.forFeature({ tableName: "user_event" })],
  controllers: [],
  providers: [UsersEventsService],
  exports: [UsersEventsService],
})
export class UsersEventsModule {}
