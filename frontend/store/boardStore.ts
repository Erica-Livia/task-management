import { create } from 'zustand';
import api from '../services/api';
import { Board, Column, Task, Subtask } from '../types/taskbuddy';

interface CreateTaskDto {
    title: string;
    description?: string;
    columnId: number;
    subtasks?: string[];
}

interface UpdateTaskDto {
    title?: string;
    description?: string;
    columnId?: number;
    subtasks?: { id?: number; title: string; isCompleted: boolean }[];
}

interface ReorderTasksDto {
    id: number;
    position: number;
    columnId: number;
}

interface BoardState {
    boards: Pick<Board, 'id' | 'name'>[];
    activeBoard: Board | null;
    selectedTask: Task | null;
    editingBoard: Board | null;
    editingTask: Task | null;
    itemToDelete: { id: number; name: string } | null;
    modalType: 'board' | 'task' | 'column' | null;
    isBoardModalOpen: boolean;
    isDeleteModalOpen: boolean;
    isTaskModalOpen: boolean;
    isLoading: boolean;
    error: string | null;

    fetchBoards: () => Promise<void>;
    fetchBoardById: (id: number) => Promise<void>;

    createBoard: (boardData: { name: string; columns: string[] }) => Promise<Board | null>;
    updateBoard: (boardId: number, boardData: { name: string; columns: { id?: number; name: string }[] }) => Promise<void>;
    deleteBoard: (boardId: number) => Promise<void>;

    addColumn: (name: string) => Promise<void>;
    updateColumn: (columnId: number, name: string) => Promise<void>;
    deleteColumn: (columnId: number) => Promise<void>;

    addTask: (taskData: CreateTaskDto) => Promise<void>;
    updateTask: (taskId: number, taskData: { columnId: number }) => Promise<void>;
    deleteTask: (taskId: number) => Promise<void>;
    reorderTasks: (reorderedTasks: ReorderTasksDto[]) => Promise<void>;
    setOptimisticBoard: (updatedBoard: Board) => void;

    selectTask: (task: Task) => void;
    clearSelectedTask: () => void;
    toggleSubtask: (subtaskId: number, taskId: number) => Promise<void>;

    openBoardModal: (board?: Board | null) => void;
    closeBoardModal: () => void;
    openTaskModal: (task?: Task) => void;
    closeTaskModal: () => void;
    openDeleteModal: (type: "board" | "task" | "column", item: { columns: any[]; name: string; id: number }) => void;
    closeDeleteModal: () => void;
}

interface BoardApiResponse {
    data: Board;
}

interface BoardsListApiResponse extends Array<Pick<Board, 'id' | 'name'>> {}


export const useBoardStore = create<BoardState>((set, get) => ({
    boards: [],
    activeBoard: null,
    selectedTask: null,
    editingBoard: null,
    editingTask: null,
    itemToDelete: null,
    modalType: null,
    isBoardModalOpen: false,
    isDeleteModalOpen: false,
    isTaskModalOpen: false,
    isLoading: true,
    error: null,

    fetchBoards: async () => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.get<BoardsListApiResponse>('/boards');
            set({ boards: response.data });
        } catch (error) {
            set({ error: 'Failed to fetch boards.' });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchBoardById: async (id) => {
        try {
            set({ isLoading: true, error: null, activeBoard: null });
            const response = await api.get<BoardApiResponse>(`/boards/${id}`);
            set({ activeBoard: response.data.data });
        } catch (error) {
            set({ error: `Failed to fetch board with id ${id}.`, activeBoard: null });
        } finally {
            set({ isLoading: false });
        }
    },

    openBoardModal: (board) => set({ isBoardModalOpen: true, editingBoard: board || null }),
    closeBoardModal: () => set({ isBoardModalOpen: false, editingBoard: null }),

    openTaskModal: (task) => set({ isTaskModalOpen: true, editingTask: task || null }),
    closeTaskModal: () => set({ isTaskModalOpen: false, editingTask: null }),

    openDeleteModal: (type, item) => set({ isDeleteModalOpen: true, modalType: type, itemToDelete: item }),
    closeDeleteModal: () => set({ isDeleteModalOpen: false, modalType: null, itemToDelete: null }),

    createBoard: async (boardData) => {
        try {
            const response = await api.post('/boards', boardData);
            await get().fetchBoards();
            return response.data.data;
        } catch (error) {
            console.error("Failed to create board", error);
            return null;
        }
    },

    updateBoard: async (boardId, boardData) => {
        const originalBoard = get().activeBoard;
        try {
            await api.patch(`/boards/${boardId}`, boardData);
            await get().fetchBoards();
            await get().fetchBoardById(boardId);
        } catch (error) {
            set({ activeBoard: originalBoard });
            console.error("Failed to update board", error);
        }
    },

    deleteBoard: async (boardId) => {
        try {
            await api.delete(`/boards/${boardId}`);
            set({ activeBoard: null });
            await get().fetchBoards();
            get().closeDeleteModal();
        } catch (error) {
            console.error("Failed to delete board", error);
        }
    },

    addColumn: async (name) => {
        const { activeBoard, fetchBoardById } = get();
        if (!activeBoard) return;
        try {
            await api.post('/columns', { name, boardId: activeBoard.id });
            await fetchBoardById(activeBoard.id);
        } catch (error) {
            console.error("Failed to add column", error);
        }
    },

    updateColumn: async (columnId, name) => {
        const { activeBoard } = get();
        if (!activeBoard) return;
        const originalBoard = { ...activeBoard };
        const updatedBoard = { ...activeBoard, columns: activeBoard.columns.map(c => c.id === columnId ? { ...c, name } : c) };
        set({ activeBoard: updatedBoard });
        try {
            await api.patch(`/columns/${columnId}`, { name });
        } catch (error) {
            set({ activeBoard: originalBoard });
            console.error("Failed to update column, reverting.", error);
        }
    },

    deleteColumn: async (columnId) => {
        const { activeBoard, fetchBoardById, closeDeleteModal } = get();
        if (!activeBoard) return;
        try {
            await api.delete(`/columns/${columnId}`);
            await fetchBoardById(activeBoard.id);
            closeDeleteModal();
        } catch (error) {
            console.error("Failed to delete column", error);
        }
    },

    addTask: async (taskData) => {
        const { activeBoard, fetchBoardById, closeTaskModal } = get();
        if (!activeBoard) return;
        try {
            await api.post('/tasks', taskData);
            await fetchBoardById(activeBoard.id);
            closeTaskModal();
        } catch (error) {
            console.error("Failed to add task", error);
        }
    },

    updateTask: async (taskId, taskData) => {
        const { activeBoard, fetchBoardById, closeTaskModal } = get();
        if (!activeBoard) return;
        try {
            await api.patch(`/tasks/${taskId}`, taskData);
            await fetchBoardById(activeBoard.id);
            closeTaskModal();
        } catch (error) {
            console.error("Failed to update task", error);
        }
    },

    deleteTask: async (taskId) => {
        const { activeBoard, fetchBoardById, closeDeleteModal, clearSelectedTask } = get();
        if (!activeBoard) return;
        try {
            await api.delete(`/tasks/${taskId}`);
            await fetchBoardById(activeBoard.id);
            closeDeleteModal();
            clearSelectedTask();
        } catch (error) {
            console.error("Failed to delete task", error);
        }
    },

    setOptimisticBoard: (updatedBoard) => set({ activeBoard: updatedBoard }),

    reorderTasks: async (reorderedTasks) => {
        const { activeBoard } = get();
        const originalBoard = { ...activeBoard! };
        try {
            await api.post('/tasks/reorder', { tasks: reorderedTasks });
        } catch (error) {
            console.error("Failed to reorder tasks, reverting.", error);
            set({ activeBoard: originalBoard });
        }
    },

    selectTask: (task) => set({ selectedTask: task }),

    clearSelectedTask: () => set({ selectedTask: null }),

    toggleSubtask: async (subtaskId, taskId) => {
        const originalBoard = get().activeBoard;
        if (!originalBoard) return;

        let updatedTask: Task | undefined;
        const updatedBoard = {
            ...originalBoard,
            columns: originalBoard.columns.map(col => ({
                ...col,
                tasks: col.tasks.map(task => {
                    if (task.id === taskId) {
                        const newSubtasks = task.subtasks.map(sub =>
                            sub.id === subtaskId ? { ...sub, isCompleted: !sub.isCompleted } : sub
                        );
                        updatedTask = { ...task, subtasks: newSubtasks };
                        return updatedTask;
                    }
                    return task;
                })
            }))
        };

        set({ activeBoard: updatedBoard, selectedTask: updatedTask });

        try {
            const targetSubtask = updatedTask?.subtasks.find(s => s.id === subtaskId);
            if (targetSubtask) {
                await api.patch(`/subtasks/${subtaskId}`, { isCompleted: targetSubtask.isCompleted });
            }
        } catch (error) {
            console.error("Failed to update subtask, reverting.", error);
            set({ activeBoard: originalBoard, selectedTask: originalBoard.columns.flatMap(c => c.tasks).find(t => t.id === taskId) });
        }
    },
}));