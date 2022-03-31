import { Injectable } from "@nestjs/common";
import { CreateFileDto } from "./dto/create-file.dto";
import { UpdateFileDto } from "./dto/update-file.dto";
import { promisify } from "util";
import * as fs from "fs";
import { AvatarFile } from "./models/avatar.model";
import { DatabaseTable } from "../database/database.decorator";
import { DatabaseService } from "../database/database.service";
import { Event } from "../events/models/event.model";
import { ConfigService } from "../config/config.service";
import { f } from "@deepkit/type";

@Injectable()
export class FilesService {
  constructor(
    @DatabaseTable("avatar_file")
    private readonly db: DatabaseService<AvatarFile>,
    private readonly configService: ConfigService
  ) {
    this.configService = new ConfigService({
      useProcess: true,
    });
  }

  create(createFileDto: CreateFileDto) {
    return "This action adds a new file";
  }

  findAll() {
    return `This action returns all files`;
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }

  async findOneAvatarFile(id: number): Promise<AvatarFile> {
    return this.db.query({
      query: "*",
      where: "id = " + id,
    });
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  async saveAvatarFile(file): Promise<AvatarFile> {
    const { originalname, filename, mimetype, size } = file;
    const extension = mimetype.split("/")[1];
    const now = Date.now();
    return await this.db.insert({
      query:
        "original_filename, current_filename, extension, size, created_at, updated_at",
      where: `'${originalname}', '${filename}', '${extension}', ${size} ,${now}, ${now}`,
    });
  }

  async removeAvatarFile(pseudo: string, id: number): Promise<AvatarFile> {
    await this.unlinkAvatarFile(pseudo, id);
    return this.db.delete({
      query: "",
      where: "id = " + id,
    });
  }

  async unlinkAvatarFile(pseudo: string, fileId: number) {
    const unlinkAsync = promisify(fs.unlink);
    const file = await this.db.query({
      query: "*",
      where: "id = " + fileId,
    });
    const { current_filename } = file;
    console.log(
      this.configService.getUploadPath() +
        `/profil/${pseudo}/` +
        current_filename
    );
    await unlinkAsync(
      this.configService.getUploadPath() +
        `/profil/${pseudo}/` +
        current_filename
    );
  }
}
