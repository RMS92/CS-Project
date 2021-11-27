import { Injectable, Provider } from "@nestjs/common";
import { DatabaseTable } from "../database/database.decorator";
import { DatabaseService } from "../database/database.service";
import { User } from "./schemas/user.schema";
import { Observable } from "rxjs";

@Injectable()
export class UsersService {
  constructor(
    @DatabaseTable("user")
    private readonly db: DatabaseService<User>
  ) {}

  async findAll(): Promise<User[]> {
    return this.db.queryAll({
      query: "*",
      where: "",
    });
  }

  async findOne(id: number): Promise<User> {
    return this.db.query({
      query: "*",
      where: "id = " + id,
    });
  }

  create() {}
}
