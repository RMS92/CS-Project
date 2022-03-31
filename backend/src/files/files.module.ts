import { Module } from "@nestjs/common";
import { FilesService } from "./files.service";
import { FilesController } from "./files.controller";
import { DatabaseModule } from "../database/database.module";
import { ConfigModule } from "../config/config.module";

@Module({
  imports: [
    DatabaseModule.forFeature({ tableName: "avatar_file" }),
    ConfigModule.Deferred,
  ],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
