import { Module } from "@nestjs/common";
import { EventsService } from "./events.service";
import { EventsController } from "./events.controller";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [DatabaseModule.forFeature({ tableName: "event" })],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
