import { IsNotEmpty } from "class-validator";

export class CreateUserEventDto {
  user_id: string;

  event_id: string;
}
