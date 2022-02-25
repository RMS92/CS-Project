import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Provider,
  Patch,
  Delete,
  UseGuards,
  Req,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "./models/user.model";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdateUserPasswordDto } from "./dto/update-user-password.dto";
import { AuthenticatedGuard } from "../auth/guards/authenticated-auth.guard";
import { DeleteUserDto } from "./dto/delete-user.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthenticatedGuard)
  async findAll(@Req() req): Promise<User[]> {
    const id = req.user.id;
    return this.usersService.findAll(+id);
  }

  @Get("events")
  async findAllUsersEvents(): Promise<User[]> {
    return this.usersService.findAllUsersEvents();
  }

  @Get("events/:id")
  findUsersEvents(@Param("id") id: string): Promise<User[]> {
    return this.usersService.findUsersEvents(+id);
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<User> {
    return this.usersService.findOne(+id);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Patch(":id")
  @UseGuards(AuthenticatedGuard)
  async update(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req
  ): Promise<User> {
    const authId = req.user.id;
    return this.usersService.update(+id, authId, updateUserDto);
  }

  @Patch(":id/pseudo")
  @UseGuards(AuthenticatedGuard)
  async updatePseudo(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req
  ): Promise<User> {
    const authId = req.user.id;
    return this.usersService.updatePseudo(+id, authId, updateUserDto);
  }

  @Patch(":id/password")
  @UseGuards(AuthenticatedGuard)
  async updatePassword(
    @Param("id") id: string,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
    @Req() req
  ): Promise<User> {
    const authId = req.user.id;
    return this.usersService.updatePassword(+id, authId, updateUserPasswordDto);
  }

  @Delete(":id")
  @UseGuards(AuthenticatedGuard)
  async delete(@Param("id") id: string, @Req() req): Promise<Boolean> {
    const authId = req.user.id;
    req.logout();
    return this.usersService.delete(+id, authId);
  }
}
