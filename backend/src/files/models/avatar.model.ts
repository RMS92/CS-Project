import { t } from "@deepkit/type";

export class AvatarFile {
  @t
  id: string;

  @t
  original_filename: string;

  @t
  current_filename: string;

  @t
  extension: string;

  @t
  size: number;

  @t
  created_at: Date;

  @t
  updated_at: Date;
}
