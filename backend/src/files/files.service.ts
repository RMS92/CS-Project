import { Injectable } from "@nestjs/common";
import { CreateFileDto } from "./dto/create-file.dto";
import { UpdateFileDto } from "./dto/update-file.dto";
import { promisify } from "util";
import * as fs from "fs";
import { AvatarFile } from "./models/avatar.model";
import { DatabaseTable } from "../database/database.decorator";
import { DatabaseService } from "../database/database.service";
import { ConfigService } from "../config/config.service";

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

  securityLevel: number = this.configService.databaseSecurity.securityLevel;

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
    if (this.securityLevel === 1 || this.securityLevel === 2) {
      return this.db.query({
        query: "*",
        where: "id = " + id,
      });
    } else {
      const where = "id = $1";
      return this.db.preparedQuery({
        query: "*",
        where,
        variables: [id],
      });
    }
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  async saveAvatarFile(file): Promise<AvatarFile> {
    const { originalname, filename, mimetype, size } = file;
    const extension = mimetype.split("/")[1];
    const now = Date.now();
    if (this.securityLevel === 1 || this.securityLevel === 2) {
      return await this.db.insert({
        query:
          "original_filename, current_filename, extension, size, created_at, updated_at",
        where: `'${originalname}', '${filename}', '${extension}', ${size} ,${now}, ${now}`,
      });
    } else {
      const where = `$${1}, $${2}, $${3}, $${4}, $${5}, $${6}`;
      return this.db.preparedInsert({
        query:
          "original_filename, current_filename, extension, size, created_at, updated_at",
        where,
        variables: [originalname, filename, extension, size, now, now],
      });
    }
  }

  async removeAvatarFile(pseudo: string, id: number): Promise<AvatarFile> {
    await this.unlinkAvatarFile(pseudo, id);
    if (this.securityLevel === 1 || this.securityLevel === 2) {
      return this.db.delete({
        query: "",
        where: "id = " + id,
      });
    } else {
      const where = "id = $1";
      return this.db.preparedDelete({
        query: "",
        where,
        variables: [id],
      });
    }
  }

  async unlinkAvatarFile(pseudo: string, fileId: number) {
    const unlinkAsync = promisify(fs.unlink);
    let file = null;
    if (this.securityLevel === 1 || this.securityLevel === 2) {
      file = await this.db.query({
        query: "*",
        where: "id = " + fileId,
      });
    } else {
      const where = "id = $1";
      file = await this.db.preparedQuery({
        query: "*",
        where,
        variables: [fileId],
      });
    }

    const { current_filename } = file;
    await unlinkAsync(
      this.configService.getUploadPath() +
        `/profil/${pseudo}/` +
        current_filename
    );
  }
}
