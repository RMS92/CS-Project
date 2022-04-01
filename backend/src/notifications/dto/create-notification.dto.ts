import { IsNotEmpty, IsString } from "class-validator";

export class CreateNotificationDto {
  id: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  channel: string;

  created_at: Date;

  read_at: Date;

  user_id: string;
}
