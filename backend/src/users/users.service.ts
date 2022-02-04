import { Injectable, Provider } from "@nestjs/common";
import { DatabaseTable } from "../database/database.decorator";
import { DatabaseService } from "../database/database.service";
import { User } from "./models/user.model";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdateUserPasswordDto } from "./dto/update-user-password.dto";
import { PseudoAlreadyUsedException } from "../security/exceptions/pseudo-already-used.exception";

@Injectable()
export class UsersService {
  constructor(
    @DatabaseTable("user")
    private readonly db: DatabaseService<User>
  ) {}

  securityLevel: number = 3;

  // DONE
  async findAll(): Promise<User[]> {
    if (this.securityLevel === 1) {
      return this.db.queryAll({
        query: "*",
        where: "",
      });
    } else {
      return this.db.preparedQueryAll({
        query: "*",
        where: "",
        variables: [],
      });
    }
  }

  // DONE
  async findAllUsersEvents(): Promise<User[]> {
    if (this.securityLevel === 1) {
      return this.db.join({
        query: "public.user.id, public.user.pseudo, public.user_event.event_id",
        join: "user_event",
        joinCondition: "public.user_event.user_id = public.user.id",
        where: "",
      });
    } else {
      return this.db.preparedJoin({
        query: "public.user.id, public.user.pseudo, public.user_event.event_id",
        join: "user_event",
        joinCondition: "public.user_event.user_id = public.user.id",
        where: "",
        variables: [],
      });
    }
  }

  // DONE
  async findUsersEvents(id: number): Promise<User[]> {
    if (this.securityLevel === 1) {
      return this.db.join({
        query: "public.user.id, public.user.pseudo",
        join: "user_event",
        joinCondition: "public.user.id = public.user_event.user_id",
        where: " WHERE public.user_event.event_id = " + id,
      });
    } else {
      return this.db.preparedJoin({
        query: "public.user.id, public.user.pseudo",
        join: "user_event",
        joinCondition: "public.user.id = public.user_event.user_id",
        where: " WHERE public.user_event.event_id = $1",
        variables: [id],
      });
    }
  }

  // DONE
  async findOne(id: number): Promise<User> {
    if (this.securityLevel === 1) {
      return this.db.query({
        query: "id, pseudo",
        where: "id = " + id,
      });
    } else {
      const where = "id = $1";
      return this.db.preparedQuery({
        query: "id, pseudo",
        where,
        variables: [id],
      });
    }
  }

  // DONE
  async findByPseudo(field: string): Promise<User> {
    if (this.securityLevel === 1) {
      return this.db.query({
        query: "*",
        where: "pseudo = " + `'${field}'`,
      });
    } else {
      const where = "pseudo = $1";
      return this.db.preparedQuery({
        query: "*",
        where,
        variables: [field],
      });
    }
  }

  // DONE
  async findByPseudoAndPassword(
    pseudo: string,
    password: string
  ): Promise<User> {
    if (this.securityLevel === 1) {
      return this.db.query({
        query: "*",
        where:
          "pseudo = " + `'${pseudo}'` + " AND password = " + `'${password}'`,
      });
    } else {
      const where = "pseudo = $1 AND password = $2";
      return this.db.preparedQuery({
        query: "*",
        where,
        variables: [pseudo, password],
      });
    }
  }

  // DONE
  async pseudoExists(pseudo: string): Promise<boolean> {
    let user;
    if (this.securityLevel === 1) {
      user = await this.db.query({
        query: "*",
        where: "pseudo = " + `'${pseudo}'`,
      });
    } else {
      const where = "pseudo = $1";
      user = await this.db.preparedQuery({
        query: "*",
        where,
        variables: [pseudo],
      });
    }
    return !!user;
  }

  // DONE
  async create(createUserDto: CreateUserDto): Promise<User> {
    const now = Date.now();
    if (this.securityLevel === 1) {
      return this.db.insert({
        query: "pseudo, password, role, created_at, updated_at",
        where: `'${createUserDto.pseudo}', '${createUserDto.password}', 'ROLE_USER', ${now}, ${now}`,
      });
    } else {
      const where = `$${1}, $${2}, $${3}, $${4}, $${5}`;
      return this.db.preparedInsert({
        query: "pseudo, password, role, created_at, updated_at",
        where,
        variables: [
          createUserDto.pseudo,
          createUserDto.password,
          "ROLE_USER",
          now,
          now,
        ],
      });
    }
  }

  // DONE
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    if (this.securityLevel === 1) {
      return this.db.update({
        query: `pseudo = '${updateUserDto.pseudo}'`,
        where: "id = " + id,
      });
    } else {
      const where = "id = $2";
      return this.db.preparedUpdate({
        query: "pseudo = $1",
        where,
        variables: [updateUserDto.pseudo, id],
      });
    }
  }

  // DONE
  async updatePseudo(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const pseudo = updateUserDto.pseudo.toLowerCase();

    const pseudoExists = await this.pseudoExists(pseudo);

    if (!pseudoExists) {
      if (this.securityLevel === 1) {
        return this.db.update({
          query: `pseudo = '${updateUserDto.pseudo}'`,
          where: "id = " + id,
        });
      } else {
        const where = "id = $2";
        return this.db.preparedUpdate({
          query: "pseudo = $1",
          where,
          variables: [updateUserDto.pseudo, id],
        });
      }
    } else {
      throw new PseudoAlreadyUsedException();
    }
  }

  // DONE
  async updatePassword(
    id: number,
    updateUserPasswordDto: UpdateUserPasswordDto
  ): Promise<User> {
    if (this.securityLevel === 1) {
      return this.db.update({
        query: `password = '${updateUserPasswordDto.password}'`,
        where: "id = " + id,
      });
    } else {
      const where = "id = $2";
      return this.db.preparedUpdate({
        query: "password = $1",
        where,
        variables: [updateUserPasswordDto.password, id],
      });
    }
  }

  // DONE
  async delete(id: number): Promise<User> {
    if (this.securityLevel === 1) {
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
}
