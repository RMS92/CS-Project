import { IsString, Length } from "class-validator";

export class UpdateUserDto {
  @IsString()
  @Length(0, 50)
  pseudo: string;
}
