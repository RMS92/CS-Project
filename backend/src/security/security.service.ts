import { HttpStatus, Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { AuthService } from "../auth/auth.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { TokenExpiredException } from "./exceptions/token-expired.exception";
import { EmailAlreadyUsedException } from "./exceptions/email-already-used.exception";
import { PseudoAlreadyUsedException } from "./exceptions/pseudo-already-used.exception";
import { PasswordsDoNotMatchException } from "./exceptions/passwords-do-not-match.exception";
import { UpdatePasswordDto } from "./dto/update-password.dto";
import { InvalidPasswordException } from "./exceptions/invalid-password.exception";
import { User } from "../users/models/user.model";

@Injectable()
export class SecurityService {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) {}

  async loginLocal(req: any): Promise<User> {
    // Set ip address when user login
    /*await this.usersService.updateField(req.user._id, {
      last_login_ip: req.ip,
      last_login_at: Date.now(),
    });*/
    return req.user;
  }

  async register(createUserDTO: CreateUserDto): Promise<Object> {
    // Format pseudo
    createUserDTO.pseudo = createUserDTO.pseudo.toLowerCase();

    const pseudoExists = await this.usersService.pseudoExists(
      createUserDTO.pseudo
    );
    if (!pseudoExists) {
      if (createUserDTO.password2 === createUserDTO.password) {
        // Hash passwords ?
        // Send confirmation email
        // Create account
        await this.usersService.create(createUserDTO);

        return {
          status: HttpStatus.OK,
          message: "Votre compte a bien été crée.",
          success: true,
        };
      } else {
        throw new PasswordsDoNotMatchException();
      }
    } else {
      throw new PseudoAlreadyUsedException();
    }
  }
}
