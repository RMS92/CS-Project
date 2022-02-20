import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { SecurityService } from "./security.service";
import { User } from "../users/models/user.model";
import { LocalAuthGuard } from "../auth/guards/local-auth.guard";
import { AuthenticatedGuard } from "../auth/guards/authenticated-auth.guard";

@Controller()
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Post("login")
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  passportLogin(@Req() req): Promise<User> {
    return this.securityService.loginLocal(req);
  }

  @Post("register")
  @HttpCode(201)
  register(@Body() createUserDTO: CreateUserDto) {
    return this.securityService.register(createUserDTO);
  }

  /*@Patch("users/:id/password")
  @CheckUsersPolicies((ability: UserAbility) =>
    ability.can(Action.Update, User)
  )
  @UseGuards(AuthenticatedGuard, UsersPoliciesGuard)
  updatePassword(
    @Param("id") id: string,
    @Body() updatePasswordDto: UpdatePasswordDto
  ): Promise<Object> {
    return this.securityService.updatePassword(id, updatePasswordDto);
  } */

  /*@Delete('users/:id/profil')
  @CheckUsersPolicies((ability: UserAbility) =>
    ability.can(Action.Delete, User),
  )
  @UseGuards(AuthenticatedGuard, UsersPoliciesGuard)
  deleteAccount(
    @Req() req,
    @Param('id') id: string,
    @Body() deleteAccountDto: DeleteAccountDto,
  ): Promise<Object> {
    return this.securityService.deleteAccount(req, id, deleteAccountDto);
  }*/

  @Get("me")
  @UseGuards(AuthenticatedGuard)
  me(@Req() req) {
    return req.user;
  }

  @Get("logout")
  logout(@Req() req) {
    req.logout();
    return false;
  }
}
