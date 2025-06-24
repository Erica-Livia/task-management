"use client";
import React from 'react';
import Link from 'next/link';
import Button from './Button';

interface User {
    name: string;
    email: string;
}

interface HeaderProps {
    user: User | null;
    onLogout: () => void;
}

const TaskBuddyLogo: React.FC = () => (
    <svg width="24" height="25" viewBox="0 0 24 25" xmlns="http://www.w3.org/2000/svg">
        <rect width="6" height="25" rx="2" fill="#635FC7"/>
        <rect opacity="0.75" x="9" width="6" height="25" rx="2" fill="#635FC7"/>
        <rect opacity="0.5" x="18" width="6" height="25" rx="2" fill="#635FC7"/>
    </svg>
);


const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
    return (
        <header className="bg-white p-4 shadow-2xl dark:bg-gray-dark border-b border-gray-300 dark:border-gray-dark">
            <nav className="mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <TaskBuddyLogo />
                    <span className="text-xl font-bold text-black dark:text-white">Task Buddy</span>
                </Link>

                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <span className="hidden sm:block text-gray-medium">
                                Welcome, <span className="font-bold">{user.name.split(' ')[0]}</span>
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
                                <Link href="/signin">
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