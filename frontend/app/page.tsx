"use client";
import React, { useState, useEffect } from 'react';
import {useParams, useRouter} from 'next/navigation';
import toast from 'react-hot-toast';
import Header from '@/components/Header';
import Sidebar from "@/components/Sidebar";
import BoardView from "@/components/BoardView";
import {useBoardStore} from "@/store/boardStore";

interface User {
    name: string;
    email: string;
}

const FullScreenLoader = () => (
    <div className="flex min-h-screen items-center justify-center bg-gray-light dark:bg-gray-v-dark">
        <p className="text-gray-medium">Loading...</p>
    </div>
);

function Page() {
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
        // Fetch the specific board data whenever the ID in the URL changes
        if (boardId) {
            fetchBoardById(boardId);
        }
    }, [boardId, fetchBoardById]);

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

    if (isLoading) {
        return <FullScreenLoader />;
    }

    return (
        <div className="flex h-screen bg-gray-light font-sans dark:bg-gray-v-dark">
            <Sidebar activeBoardId={boardId} />
            <div className="flex flex-col w-full">
                <Header user={user} onLogout={handleLogout} />
                <BoardView board={activeBoard} />
            </div>

        </div>
    );
}

export default Page;