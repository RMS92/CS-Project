import { IsArray, IsNotEmpty, isNumber, IsString } from "class-validator";

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  place: string;

  @IsArray()
  users_ids: Array<string>;

  duration: Date;

  begin_at: Date;

  start_time: number;
}
