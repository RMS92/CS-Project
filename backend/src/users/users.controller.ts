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

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
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

  @Delete(":id")
  async delete(@Param("id") id: string): Promise<User> {
    return this.usersService.delete(+id);
  }
}
