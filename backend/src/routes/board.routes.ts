import express from 'express';
import { 
  createBoardHandler, 
  getBoardsHandler, 
  getBoardHandler, 
  updateBoardHandler, 
  deleteBoardHandler 
} from '../controllers/board.controller';
import { validate } from '../middleware/validate.middleware';
import { requireUser } from '../middleware/requireUser.middleware';
import { 
  createBoardSchema, 
  getOrDeleteBoardSchema, 
  updateBoardSchema 
} from '../schemas/board.schema';


const router = express.Router();
router.use(requireUser);

router.post('/', validate(createBoardSchema), createBoardHandler);

router.get('/', getBoardsHandler);

router.get('/:boardId', validate(getOrDeleteBoardSchema), getBoardHandler);

router.patch('/:boardId', validate(updateBoardSchema), updateBoardHandler);

router.delete('/:boardId', validate(getOrDeleteBoardSchema), deleteBoardHandler);

export default router;