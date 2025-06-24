"use client";
import React, {useEffect, useState} from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useBoardStore } from '@/store/boardStore';
import Sidebar from '@/components/Sidebar';
import BoardView from '@/components/BoardView';
import Header from "@/components/Header";
import toast from "react-hot-toast";
// import FullScreenLoader from '@/components/FullScreenLoader';

interface User {
    name: string;
    email: string;
}


export default function BoardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const params = useParams();
    const boardId = parseInt(params.boardId as string, 10);
    const router = useRouter();


    const {
        fetchBoards,
        fetchBoardById,
        activeBoard,
        error,
    } = useBoardStore();

    useEffect(() => {
        fetchBoards();
    }, [fetchBoards]);

    useEffect(() => {
        if (boardId) {
            fetchBoardById(boardId);
        }
    }, [boardId, fetchBoardById]);

    if (error) {
        return <div className="text-red-500 text-center mt-10">{error}</div>
    }

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleLogout = () => {
        toast.success('Logged out successfully!');

        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');

        setUser(null);
        router.push('/signin');
    };

    return (
        <div className="flex flex-col h-screen">
            <Header user={user} onLogout={handleLogout} />
            <div className="flex flex-grow overflow-hidden">
                <Sidebar activeBoardId={boardId} />
                <BoardView board={activeBoard} />
            </div>
        </div>
    );
}