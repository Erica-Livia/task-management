"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Header from '@/components/Header';

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
    const router = useRouter();

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
        <div className="min-h-screen bg-gray-light font-sans dark:bg-gray-v-dark">
            <Header user={user} onLogout={handleLogout} />

            <main className="container mx-auto mt-10 p-8 text-center">
                {user ? (
                    <div className="space-y-4">
                        <h1 className="text-xl font-bold text-black dark:text-white">
                            Welcome back, {user.name}!
                        </h1>
                        <p className="text-body-lg text-gray-medium">
                            You are successfully logged in. Your dashboard and tasks will appear here soon.
                        </p>
                        <p className="text-xs text-gray-medium">
                            Your registered email is: {user.email}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <h1 className="text-xl font-bold text-black dark:text-white">
                            Welcome to the Task Buddy Task Manager
                        </h1>
                        <p className="text-body-lg text-gray-medium">
                            Please log in or create an account to manage your projects and tasks.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Page;