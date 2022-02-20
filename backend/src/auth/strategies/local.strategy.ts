import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { User } from "../../users/models/user.model";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: "pseudo" });
  }

  async validate(pseudo: string, password: string): Promise<User> {
    return this.authService.validateUser(pseudo, password);
  }
}
