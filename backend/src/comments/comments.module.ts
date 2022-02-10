import { Module } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { CommentsController } from "./comments.controller";
import { DatabaseModule } from "../database/database.module";
import { ConfigModule } from "../config/config.module";

@Module({
  imports: [
    DatabaseModule.forFeature({ tableName: "comment" }),
    ConfigModule.Deferred,
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
