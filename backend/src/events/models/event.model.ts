import { t } from "@deepkit/type";

export class Event {
  @t
  id: string;

  @t
  title: string;

  @t
  content: string;

  @t
  place: string;

  @t
  duration: Date;

  @t
  start_time: string;

  @t
  created_at: Date;

  @t
  updated_at: Date;

  @t
  user_id: string;
}
