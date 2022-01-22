import { t } from "@deepkit/type";

export class Comment {
  @t
  id: string;

  @t
  content: string;

  @t
  user_id: string;

  @t
  event_id: string;

  @t
  created_at: Date;

  @t
  updated_at: Date;
}
