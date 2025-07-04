"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface User {
    name: string;
    email: string;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            } else {
                router.push('/signin');
            }
        } catch (error) {
            console.error("Auth check failed", error);
            router.push('/signin');
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    const handleLogout = () => {
        toast.success('Logged out successfully!');
        localStorage.clear();
        setUser(null);
        router.push('/signin');
    };

    return { user, isLoading, handleLogout };
}