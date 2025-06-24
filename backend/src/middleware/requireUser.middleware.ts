import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../modals/User'; 

export const requireUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
   
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: 1 });

    if (!user) {
      res.status(401).json({ message: 'Authentication required. User not found.' });
      return;
    }

    res.locals.user = user;
    
    next();
  } catch (error) {
    next(error);
  }
};