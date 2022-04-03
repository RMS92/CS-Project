import { Injectable, Provider } from "@nestjs/common";
import { DatabaseTable } from "../database/database.decorator";
import { DatabaseService } from "../database/database.service";
import { User } from "./models/user.model";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdateUserPasswordDto } from "./dto/update-user-password.dto";
import { PseudoAlreadyUsedException } from "../security/exceptions/pseudo-already-used.exception";
import { ConfigService } from "../config/config.service";
import escapeInput from "../utils";
const bcrypt = require("bcrypt");
import { ForbiddenRessourceException } from "./exceptions/forbidden-ressource.exception";
import { FilesService } from "../files/files.service";

@Injectable()
export class UsersService {
  constructor(
    @DatabaseTable("user")
    private readonly db: DatabaseService<User>,
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {
    this.configService = new ConfigService({
      useProcess: true,
    });
  }

  securityLevel: number = this.configService.databaseSecurity.securityLevel;

  async findAll(): Promise<User[]> {
    if (this.securityLevel === 1 || this.securityLevel === 2) {
      return this.db.queryAll({
        query: "id,pseudo",
        where: "",
      });
    } else {
      return this.db.preparedQueryAll({
        query: "id,pseudo",
        where: "",
        variables: [],
      });
    }
  }

  async findAllAdmin(role: string): Promise<User[]> {
    if (role === "ROLE_ADMIN" || role === "ROLE_SUPERADMIN") {
      if (this.securityLevel === 1 || this.securityLevel === 2) {
        return this.db.queryAll({
          query: "id,pseudo,role,created_at",
          where: "",
        });
      } else {
        return this.db.preparedQueryAll({
          query: "id,pseudo,role,created_at",
          where: "",
          variables: [],
        });
      }
    }
  }

  async findAllUsersEvents(): Promise<User[]> {
    if (this.securityLevel === 1 || this.securityLevel === 2) {
      return this.db.join({
        query:
          "public.user.id, public.user.pseudo, public.user_event.event_id, public.user.avatar_id",
        join: "user_event",
        joinCondition: "public.user_event.user_id = public.user.id",
        where: "",
      });
    } else {
      return this.db.preparedJoin({
        query:
          "public.user.id, public.user.pseudo, public.user_event.event_id, public.user.avatar_id",
        join: "user_event",
        joinCondition: "public.user_event.user_id = public.user.id",
        where: "",
        variables: [],
      });
    }
  }

  async findUsersEvents(id: number): Promise<User[]> {
    if (this.securityLevel === 1 || this.securityLevel === 2) {
      return this.db.join({
        query: "public.user.id, public.user.pseudo, public.user.avatar_id",
        join: "user_event",
        joinCondition: "public.user.id = public.user_event.user_id",
        where: " WHERE public.user_event.event_id = " + id,
      });
    } else {
      return this.db.preparedJoin({
        query: "public.user.id, public.user.pseudo, public.user.avatar_id",
        join: "user_event",
        joinCondition: "public.user.id = public.user_event.user_id",
        where: " WHERE public.user_event.event_id = $1",
        variables: [id],
      });
    }
  }

  async findOne(id: number): Promise<User> {
    if (this.securityLevel === 1 || this.securityLevel === 2) {
      return this.db.query({
        query: "id, pseudo, role, avatar_id",
        where: "id = " + id,
      });
    } else {
      const where = "id = $1";
      return this.db.preparedQuery({
        query: "id, pseudo, role, avatar_id",
        where,
        variables: [id],
      });
    }
  }

  async findByPseudo(field: string): Promise<User> {
    if (this.securityLevel === 1) {
      return this.db.query({
        query: "*",
        where: "pseudo = " + `'${field}'`,
      });
    } else if (this.securityLevel === 2) {
      const safeField = escapeInput(field);
      return this.db.query({
        query: "*",
        where: "pseudo = " + `'${safeField}'`,
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
    } else if (this.securityLevel === 2) {
      const safePseudo = escapeInput(pseudo);
      const safePassword = escapeInput(password);
      return this.db.query({
        query: "*",
        where:
          "pseudo = " +
          `'${safePseudo}'` +
          " AND password = " +
          `'${safePassword}'`,
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

  async pseudoExists(pseudo: string): Promise<boolean> {
    let user;
    if (this.securityLevel === 1) {
      user = await this.db.query({
        query: "*",
        where: "pseudo = " + `'${pseudo}'`,
      });
    } else if (this.securityLevel === 2) {
      const safePseudo = escapeInput(pseudo);
      user = await this.db.query({
        query: "*",
        where: "pseudo = " + `'${safePseudo}'`,
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

  async create(createUserDto: CreateUserDto): Promise<User> {
    const now = Date.now();
    if (this.securityLevel === 1) {
      return this.db.insert({
        query: "pseudo, password, role, created_at, updated_at",
        where: `'${createUserDto.pseudo}', '${createUserDto.password}', 'ROLE_USER', ${now}, ${now}`,
      });
    } else if (this.securityLevel === 2) {
      const safePseudo = escapeInput(createUserDto.pseudo);
      const safePassword = escapeInput(createUserDto.password);
      return this.db.insert({
        query: "pseudo, password, role, created_at, updated_at",
        where: `'${safePseudo}', '${safePassword}', 'ROLE_USER', ${now}, ${now}`,
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

  async update(
    id: number,
    authId: number,
    updateUserDto: UpdateUserDto
  ): Promise<User> {
    if (id === authId) {
      if (this.securityLevel === 1) {
        return this.db.update({
          query: `pseudo = '${updateUserDto.pseudo}'`,
          where: "id = " + id,
        });
      } else if (this.securityLevel === 2) {
        const safePseudo = escapeInput(updateUserDto.pseudo);
        return this.db.update({
          query: `pseudo = '${safePseudo}'`,
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
      throw new ForbiddenRessourceException();
    }
  }

  async updatePseudo(
    id: number,
    authId: number,
    updateUserDto: UpdateUserDto
  ): Promise<User> {
    if (id === authId) {
      const pseudo = updateUserDto.pseudo.toLowerCase();

      const pseudoExists = await this.pseudoExists(pseudo);

      if (!pseudoExists) {
        if (this.securityLevel === 1) {
          return this.db.update({
            query: `pseudo = '${updateUserDto.pseudo}'`,
            where: "id = " + id,
          });
        } else if (this.securityLevel === 2) {
          const safePseudo = escapeInput(updateUserDto.pseudo);
          return this.db.update({
            query: `pseudo = '${safePseudo}'`,
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
    } else {
      throw new ForbiddenRessourceException();
    }
  }

  async updatePassword(
    id: number,
    authId: number,
    updateUserPasswordDto: UpdateUserPasswordDto
  ): Promise<User> {
    if (id === authId) {
      const hashPassword = await this.hashPassword(
        updateUserPasswordDto.password
      );
      if (this.securityLevel === 1) {
        return this.db.update({
          query: `password = '${hashPassword}'`,
          where: "id = " + id,
        });
      } else if (this.securityLevel === 2) {
        // const safePassword = escapeInput(updateUserPasswordDto.password);
        return this.db.update({
          query: `password = '${hashPassword}'`,
          where: "id = " + id,
        });
      } else {
        const where = "id = $2";
        return this.db.preparedUpdate({
          query: "password = $1",
          where,
          variables: [hashPassword, id],
        });
      }
    } else {
      throw new ForbiddenRessourceException();
    }
  }

  async updateAvatarFile(
    userId: number,
    file: Express.Multer.File
  ): Promise<User> {
    let user = null;
    if (this.securityLevel === 1 || this.securityLevel === 2) {
      user = await this.db.query({
        query: "id, pseudo, avatar_id",
        where: "id = " + userId,
      });
    } else {
      const where = "id = $1";
      user = await this.db.preparedQuery({
        query: "id, pseudo, avatar_id",
        where,
        variables: [userId],
      });
    }

    if (user.avatar_id) {
      //remove avatar file
      await this.filesService.removeAvatarFile(user.pseudo, +user.avatar_id);
    }

    const newAvatarFile = await this.filesService.saveAvatarFile(file);
    const { id } = newAvatarFile;
    if (this.securityLevel === 1 || this.securityLevel === 2) {
      return this.db.update({
        query: "avatar_id = " + id,
        where: "id = " + userId,
      });
    } else {
      const where = "id = $2";
      return this.db.preparedUpdate({
        query: "avatar_id = $1",
        where,
        variables: [id, userId],
      });
    }
  }

  async delete(id: number, authId: number): Promise<Boolean> {
    if (id === authId) {
      if (this.securityLevel === 1 || this.securityLevel === 2) {
        await this.db.delete({
          query: "",
          where: "id = " + id,
        });
        return true;
      } else {
        const where = "id = $1";
        await this.db.preparedDelete({
          query: "",
          where,
          variables: [id],
        });
        return true;
      }
    } else {
      throw new ForbiddenRessourceException();
    }
  }

  async deleteAdmin(id: number, role: string): Promise<Boolean> {
    if (role === "ROLE_ADMIN" || role === "ROLE_SUPERADMIN") {
      if (this.securityLevel === 1 || this.securityLevel === 2) {
        await this.db.delete({
          query: "",
          where: "id = " + id,
        });
        return true;
      } else {
        const where = "id = $1";
        await this.db.preparedDelete({
          query: "",
          where,
          variables: [id],
        });
        return true;
      }
    } else {
      throw new ForbiddenRessourceException();
    }
  }

  // Hash password
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }
}
