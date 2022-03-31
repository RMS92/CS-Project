import { forwardRef, Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { DatabaseModule } from "../database/database.module";
import { ConfigModule } from "../config/config.module";
import { FilesModule } from "../files/files.module";

@Module({
  imports: [
    DatabaseModule.forFeature({ tableName: "user" }),
    FilesModule,
    ConfigModule.Deferred,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
