import { Request } from "express";

export interface ApiResponse<T> {
  status: number;
  data: T | null;
  message: string;
}
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface QueryResult<T=any> {
  status: number;
  data: T;
  message: string;
}
export interface AuthenticatedRequest extends Request {
  user?: any; // You can replace `any` with a specific `User` type if available
  cookies: { token?: string };
  query: {
    [key: string]: string;
  };
}
