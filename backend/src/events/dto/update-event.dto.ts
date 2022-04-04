import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class UpdateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  place: string;

  duration: Date;

  begin_at: Date;

  start_time: number;
}
