export interface User {
  avatar: string | null;
  email: string | null;
  phoneNumber: string | null;
  intro: string | null;
  lastLogin: number;
  loginCount: number;
  lastIp: string;
  status: boolean;
  createAt: number;
  createdAt: number;
  updatedAt: number;
  username: string;
  firstProvider: string;
  loginAt: number;
  expireAt: number;
}
