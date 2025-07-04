import { Request } from 'express';
import { User } from '../modals/User';


// @ts-ignore
export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  };
}

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Record<string, string[]>;
}

export type UserRole = 'user' | 'admin' | 'superAdmin';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}