import { Injectable, Provider } from "@nestjs/common";
import { DatabaseTable } from "../database/database.decorator";
import { DatabaseService } from "../database/database.service";
import { User } from "./models/user.model";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

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

  async findByPseudo(field: string): Promise<User> {
    return this.db.query({
      query: "*",
      where: "pseudo = " + `'${field}'`,
    });
  }

  async findByPseudoAndPassword(
    pseudo: string,
    password: string
  ): Promise<User> {
    return this.db.query({
      query: "*",
      where: "pseudo = " + `'${pseudo}'` + " AND password = " + `'${password}'`,
    });
  }

  async pseudoExists(pseudo: string): Promise<boolean> {
    const user = await this.db.query({
      query: "*",
      where: "pseudo = " + `'${pseudo}'`,
    });
    return !!user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const now = Date.now();
    return this.db.insert({
      query: "pseudo, password, role, created_at, updated_at",
      where: `'${createUserDto.pseudo}', '${createUserDto.password}', 'ROLE_USER', ${now}, ${now}`,
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    return this.db.update({
      query: `pseudo = '${updateUserDto.pseudo}'`,
      where: "id = " + id,
    });
  }

  async delete(id: number): Promise<User> {
    return this.db.delete({
      query: "",
      where: "id = " + id,
    });
  }
}
