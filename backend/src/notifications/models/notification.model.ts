import { t } from "@deepkit/type";

export class Notification {
  @t
  id: string;

  @t
  message: string;

  @t
  url: string;

  @t
  channel: string;

  @t
  created_at: Date;

  @t
  updated_at: Date;

  @t
  read_at: Date;

  @t
  user_id: string;
}
