import { create } from 'zustand';
import api from '../services/api';
import { Board } from '../types/taskbuddy';

interface BoardState {
    boards: Pick<Board, 'id' | 'name'>[];
    activeBoard: Board | null;
    isLoading: boolean;
    error: string | null;
    fetchBoards: () => Promise<void>;
    fetchBoardById: (id: number) => Promise<void>;
}

interface BoardApiResponse {
    data: Board;
}

interface BoardsListApiResponse extends Array<Pick<Board, 'id' | 'name'>> {}


export const useBoardStore = create<BoardState>((set: any) => ({
    boards: [],
    activeBoard: null,
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

    fetchBoardById: async (id: number) => {
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
}));
