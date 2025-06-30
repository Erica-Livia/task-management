"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useBoardStore } from '@/store/boardStore';
import Sidebar from '@/components/Sidebar';
import BoardView from '@/components/BoardView';
import Header from "@/components/Header";
import toast from "react-hot-toast";
import TaskModal from '@/components/TaskModal';
import AddEditTaskModal from '@/components/AddTaskModal';
import AddEditBoardModal from '@/components/AddEditBoardModal';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';

interface User {
    name: string;
    email: string;
}

const FullScreenLoader = () => (
    <div className="flex min-h-screen items-center justify-center bg-gray-light dark:bg-gray-v-dark">
        <p className="text-gray-medium">Loading Board...</p>
    </div>
);

export default function BoardPage() {
    const [user, setUser] = useState<User | null>(null);
    const params = useParams();
    const router = useRouter();
    const boardId = parseInt(params.boardId as string, 10);

    const {
        fetchBoards,
        fetchBoardById,
        activeBoard,
        isLoading,
        error,
        selectedTask,
    } = useBoardStore();

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            } else {
                router.push('/signin');
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            setUser(null);
            router.push('/signin');
        }
    }, [router]);

    useEffect(() => {
        fetchBoards();
    }, [fetchBoards]);

    useEffect(() => {
        if (boardId) {
            fetchBoardById(boardId);
        }
    }, [boardId, fetchBoardById]);

    const handleLogout = () => {
        toast.success('Logged out successfully!');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
        setUser(null);
        router.push('/signin');
    };

    if (isLoading && !activeBoard) {
        return <FullScreenLoader />;
    }

    if (error) {
        return <div className="text-red-500 text-center mt-10">{error}</div>;
    }

    return (
        <div className="flex flex-col h-screen bg-gray-light dark:bg-gray-v-dark">
            <Header user={user} onLogout={handleLogout} />
            <div className="flex flex-grow overflow-hidden">
                <Sidebar activeBoardId={boardId} />
                <BoardView board={activeBoard} />
            </div>

            <AddEditBoardModal />
            <AddEditTaskModal />
            <DeleteConfirmationModal />
            {selectedTask && <TaskModal />}
        </div>
    );
}