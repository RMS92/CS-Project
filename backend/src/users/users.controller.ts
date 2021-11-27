import { Body, Controller, Get, Post, Param, Provider } from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "./schemas/user.schema";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<User> {
    return this.usersService.findOne(+id);
  }

  @Post()
  create() {
    return this.usersService.create();
  }
}
