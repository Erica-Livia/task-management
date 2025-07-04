"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Button from './Button';
import { useBoardStore } from '@/store/boardStore';

interface User {
    name: string;
    email: string;
}

interface HeaderProps {
    user: User | null;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
    const { activeBoard, openBoardModal, openDeleteModal, openTaskModal } = useBoardStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleEditBoard = () => {
        if (activeBoard) {
            openBoardModal(activeBoard);
            setIsMenuOpen(false);
        }
    };

    const handleDeleteBoard = () => {
        if (activeBoard) {
            openDeleteModal('board', {
                id: activeBoard.id, name: activeBoard.name,
                columns: []
            });
            setIsMenuOpen(false);
        }
    };

    return (
        <header className="bg-white p-4 shadow-sm dark:bg-gray-dark border-b border-gray-light dark:border-gray-v-dark">
            <nav className="flex justify-between items-center space-x-4">
                <div className="flex items-center gap-4">

                    <div className="h-6 w-px bg-gray-light dark:bg-gray-dark"></div>
                    <h1 className="text-xl font-bold text-black dark:text-white">{activeBoard?.name || ''}</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="w-40">
                        <Button
                            onClick={() => openTaskModal()}
                            variant="addnew"
                            // disabled={!activeBoard || activeBoard.columns.length === 0}
                        >
                            + Add New Task
                        </Button>
                    </div>

                    {activeBoard && (
                        <div className="relative">
                            <button onClick={() => setIsMenuOpen(prev => !prev)} className="p-2 text-gray-medium">
                                <svg width="5" height="20" xmlns="http://www.w3.org/2000/svg"><g fill="#828FA3" fillRule="evenodd"><circle cx="2.308" cy="2.308" r="2.308"/><circle cx="2.308" cy="10" r="2.308"/><circle cx="2.308" cy="17.692" r="2.308"/></g></svg>
                            </button>
                            {isMenuOpen && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-v-dark rounded-lg shadow-lg p-2 z-10">
                                    <button onClick={handleEditBoard} className="w-full text-left p-2 text-gray-medium hover:bg-gray-light dark:hover:bg-gray-dark rounded">Edit Board</button>
                                    <button onClick={handleDeleteBoard} className="w-full text-left p-2 text-red hover:bg-gray-light dark:hover:bg-gray-dark rounded">Delete Board</button>
                                </div>
                            )}
                        </div>
                    )}

                    {user ? (
                        <>
                            <span className="hidden sm:block text-gray-medium">
                                <span className="font-bold">{user.name.split(' ')[0]}</span>
                            </span>
                            <div className="w-28">
                                <Button onClick={onLogout} variant="destructive">
                                    Logout
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-28">
                                <Link href="/signin">
                                    <Button variant="secondary">Login</Button>
                                </Link>
                            </div>
                            <div className="w-28">
                                <Link href="/signup">
                                    <Button variant="primary">Sign Up</Button>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;