import { t } from "@deepkit/type";

export class User {
  @t
  id: string;

  @t
  pseudo: string;

  @t
  password: string;

  @t
  role: string;

  @t
  created_at: Date;

  @t
  updated_at: Date;
}
