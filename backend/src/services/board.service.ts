import { AppDataSource } from '../config/database'; 
import { Board } from '../modals/Board';
import { Column } from '../modals/Column';
import { User } from '../modals/User';
import { CreateBoardInput, UpdateBoardInput } from '../schemas/board.schema';
import { NotFoundError } from '../utils/errors';


const boardRepository = AppDataSource.getRepository(Board);
const columnRepository = AppDataSource.getRepository(Column);

export const createBoard = async (input: CreateBoardInput, user: User) => {
 
  const newBoard = new Board();
  newBoard.name = input.name;
  newBoard.user = user;

 
  if (input.columns && input.columns.length > 0) {
    const columns = input.columns.map((columnName, index) => {
      const newColumn = new Column();
      newColumn.name = columnName;
      newColumn.position = index; 
      return newColumn;
    });
    newBoard.columns = columns;
  }
  
 
  return await boardRepository.save(newBoard);
};

export const findBoardsByUser = async (userId: number) => {
  return await boardRepository.find({
    where: { user: { id: userId } },
  });
};


export const findBoardById = async (boardId: number) => {
  return await boardRepository.findOne({
    where: { id: boardId },
    relations: {
      columns: {
        tasks: {
          subtasks: true,
        },
      },
    },
    order: {
      columns: {
        position: 'ASC',
        tasks: {
          position: 'ASC',
        },
      },
    },
  });
};


export const updateBoard = async (boardId: number, input: UpdateBoardInput) => {
  return AppDataSource.transaction(async (transactionalEntityManager) => {
    const board = await transactionalEntityManager.findOne(Board, {
      where: { id: boardId },
      relations: ['columns'],
    });

    if (!board) {
      throw new NotFoundError('Board not found');
    }

    if (input.name) {
      board.name = input.name;
    }

    if (input.columns) {
      const existingColumnIds = board.columns.map((c) => c.id);
      const incomingColumnIds = input.columns.filter(c => c.id).map(c => c.id);

      const columnsToDelete = existingColumnIds.filter(id => !incomingColumnIds.includes(id));
      if (columnsToDelete.length > 0) {
        await transactionalEntityManager.delete(Column, columnsToDelete);
      }
      
      const updatedColumns = [];
      for (const [index, colData] of input.columns.entries()) {
        let column: Column;
        if (colData.id) {
          column = await transactionalEntityManager.findOneByOrFail(Column, { id: colData.id });
        } else { 
          column = new Column();
        }
        column.name = colData.name;
        column.position = index; 
        updatedColumns.push(column);
      }
      board.columns = updatedColumns;
    }

    return await transactionalEntityManager.save(board);
  });
};


export const deleteBoard = async (boardId: number) => {
  const result = await boardRepository.delete(boardId);
  if (result.affected === 0) {
    throw new NotFoundError('Board not found');
  }
};