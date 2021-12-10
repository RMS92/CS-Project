export type Props = { [key: string]: any };

export type User = {
  id: string;
  pseudo: string;
  role: string;
  created_at: Date;
  updated_at: Date;
};

export type FlashMessage = {
  status: number;
  message: string;
  success: boolean;
};
