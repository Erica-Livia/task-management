import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../modals/User';
import { AppError } from '../utils/errors';


interface JwtPayload {
  id: number;
  email: string;
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('No token provided or invalid format', 401));
    }
    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const userRepository = AppDataSource.getRepository(User);
    const currentUser = await userRepository.findOneBy({ id: decoded.id });

    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    if (!currentUser.isActive) {
      return next(new AppError('User is not active.', 403));
    }

    req.user = currentUser;

    next();
  } catch (error) {
    return next(new AppError('Invalid token. Authentication failed.', 401));
  }
};