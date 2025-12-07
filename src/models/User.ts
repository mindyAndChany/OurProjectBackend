export interface User {
  id?: string;
  email: string;
  password: string;
  name: string;
  createdAt?: Date;
}

export interface AuthPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}
