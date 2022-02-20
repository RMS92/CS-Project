import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Provider,
  Patch,
  Delete,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "./models/user.model";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdateUserPasswordDto } from "./dto/update-user-password.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
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
  async update(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    return this.usersService.update(+id, updateUserDto);
  }

  @Patch(":id/pseudo")
  async updatePseudo(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    return this.usersService.updatePseudo(+id, updateUserDto);
  }

  @Patch(":id/password")
  async updatePassword(
    @Param("id") id: string,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto
  ): Promise<User> {
    return this.usersService.updatePassword(+id, updateUserPasswordDto);
  }

  @Delete(":id")
  async delete(@Param("id") id: string): Promise<User> {
    return this.usersService.delete(+id);
  }
}
