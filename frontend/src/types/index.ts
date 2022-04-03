import * as stream from "stream";

export type Props = { [key: string]: any };

export type User = {
  id: string;
  pseudo: string;
  role: string;
  created_at: string;
  updated_at: Date;
  avatar_id: string;
};

export type Event = {
  id: string;
  title: string;
  content: string;
  place: string;
  duration: number;
  begin_at: string;
  start_time: string;
  created_at: string;
  updated_at: Date;
  user_id: string;
};

export type CommentType = {
  id: string;
  content: string;
  user_id: string;
  event_id: string;
  created_at: string;
  updated_at: Date;
};

export type FlashMessage = {
  status: number;
  message: string;
  success: boolean;
};

export type AvatarFile = {
  id: string;
  original_filename: string;
  current_filename: string;
};

export type NotificationType = {
  id: string;
  message: string;
  url: string;
  channel: string;
  created_at: string;
  read_at: Date;
  user_id: string;
};
