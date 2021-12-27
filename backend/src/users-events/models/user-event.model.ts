import { t } from "@deepkit/type";

export class UserEvent {
  @t
  id: string;

  @t
  user_id: string;

  @t
  event_id: string;
}
