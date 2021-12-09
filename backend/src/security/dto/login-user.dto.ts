import { IsNotEmpty, IsString } from "class-validator";

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  pseudo: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
