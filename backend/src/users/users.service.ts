import { Injectable, Provider } from "@nestjs/common";
import { DatabaseTable } from "../database/database.decorator";
import { DatabaseService } from "../database/database.service";
import { User } from "./models/user.model";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { query } from "express";

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

  async findUsersEvents(id: number): Promise<User[]> {
    return this.db.join({
      query: "public.user.id, public.user.pseudo",
      join: "user_event",
      joinCondition: "public.user.id = public.user_event.user_id",
      where: "user_event.event_id = " + id,
    });
  }

  async findOne(id: number): Promise<User> {
    return this.db.query({
      query: "id, pseudo",
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
