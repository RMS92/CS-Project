import { IsNotEmpty } from "class-validator";

export class CreateUserEventDto {
  @IsNotEmpty()
  user_id: string;

  @IsNotEmpty()
  event_id: string;
}
