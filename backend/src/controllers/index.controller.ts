import { Request, Response } from 'express';

export const welcome = (req: Request, res: Response) => {
  res.json({ 
    message: 'Task Management API',
    status: 'OK', 
    uptime: process.uptime() 
  });
}