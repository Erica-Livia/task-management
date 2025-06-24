import { Request, Response, NextFunction } from 'express';
import * as BoardService from '../services/board.service';
import { CreateBoardInput, UpdateBoardInput } from '../schemas/board.schema';

export const createBoardHandler = async (
  req: Request<{}, {}, CreateBoardInput>, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const user = res.locals.user; 
    
    const board = await BoardService.createBoard(req.body, user);
    
    res.status(201).json({
      message: 'Board created successfully',
      data: board,
    });
  } catch (error) {
    next(error); 
  }
};

export const getBoardsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const boards = await BoardService.findBoardsByUser(userId);
    res.status(200).json( boards );
  } catch (error) {
    next(error);
  }
};

export const getBoardHandler = async (
  req: Request<{ boardId: string }>,
  res: Response, 
  next: NextFunction
) => {
  try {
    const boardId = parseInt(req.params.boardId, 10);
    const board = await BoardService.findBoardById(boardId);

   
    if (!board) {
      res.status(404).json({ message: 'Board not found' });
      return;
    }
    
  

    res.status(200).json({ data: board });
  } catch (error) {
    next(error);
  }
};

export const updateBoardHandler = async (
  req: Request<{ boardId: string }, {}, UpdateBoardInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const boardId = parseInt(req.params.boardId, 10);
    const updatedBoard = await BoardService.updateBoard(boardId, req.body);
    res.status(200).json({
      message: 'Board updated successfully',
      data: updatedBoard,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBoardHandler = async (
  req: Request<{ boardId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const boardId = parseInt(req.params.boardId, 10);
    await BoardService.deleteBoard(boardId);
    res.status(200).json({
        message: 'Board deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};