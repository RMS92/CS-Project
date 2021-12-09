import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { User } from "../users/models/user.model";
import { WrongPseudoException } from "./exceptions/wrong-pseudo.exception";
import { WrongPasswordException } from "./exceptions/wrong-password.exception";

const bcrypt = require("bcrypt");

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(pseudo: string, password: string): Promise<User> {
    pseudo = pseudo.toLowerCase();
    const user = await this.usersService.findByPseudo(pseudo);
    if (user) {
      const validated = await this.comparePasswords(password, user.password);
      if (validated) {
        return user;
      } else {
        throw new WrongPasswordException();
      }
    } else {
      throw new WrongPseudoException();
    }
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  async comparePasswords(
    password: string,
    storedHashPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, storedHashPassword);
  }

  async generateToken(length: number): Promise<string> {
    const rand = () => Math.random().toString(36).substr(2);
    return (rand() + rand() + rand() + rand()).substr(0, length);
  }
}
