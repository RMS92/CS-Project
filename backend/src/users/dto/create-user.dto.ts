import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from "class-validator";

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @Length(0, 50)
  pseudo: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  password2: string;
}
