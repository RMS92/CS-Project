import { Module } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { CommentsController } from "./comments.controller";
import { DatabaseModule } from "../database/database.module";

@Module({
  imports: [DatabaseModule.forFeature({ tableName: "comment" })],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
