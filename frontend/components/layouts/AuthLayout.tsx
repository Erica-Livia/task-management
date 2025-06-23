"use client";
import React, { useState, useEffect } from 'react';

const TaskBuddyLogo: React.FC = () => (
    <svg width="24" height="25" viewBox="0 0 24 25" xmlns="http://www.w3.org/2000/svg" className="mr-3">
        <rect width="6" height="25" rx="2" fill="#635FC7"/>
        <rect opacity="0.75" x="9" width="6" height="25" rx="2" fill="#635FC7"/>
        <rect opacity="0.5" x="18" width="6" height="25" rx="2" fill="#635FC7"/>
    </svg>
);

const ThemeToggle: React.FC = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark' || savedTheme === 'light') {
            setTheme(savedTheme);
            document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        }
    }, []);
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };
    return (
        <button onClick={toggleTheme} className="absolute top-5 right-5 p-2 rounded-full text-gray-medium transition-colors hover:bg-purple/10 dark:hover:bg-white/20">
            {theme === 'light' ? ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg> ) : ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707.707M6.343 6.343l-.707.707m12.728 0l-.707-.707M6.343 17.657l-.707.707M12 6a6 6 0 100 12 6 6 0 000-12z" /></svg> )}
        </button>
    );
};

interface AuthLayoutProps {
    title: string;
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, children }) => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-light font-sans dark:bg-gray-v-dark">
            <ThemeToggle />
            <main className="w-full max-w-md space-y-6 rounded-md bg-white p-8 shadow-sm dark:bg-gray-dark">
                <div className="flex items-center justify-center">
                    <TaskBuddyLogo />
                    <h1 className="text-xl font-bold text-black dark:text-white">{title}</h1>
                </div>
                {children}
            </main>
        </div>
    );
};

export default AuthLayout;