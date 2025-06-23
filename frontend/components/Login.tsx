"use client";
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import Button from './Button';
import Input from './Input';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const toastId = toast.loading('Logging in...');

        try {
            const res = await fetch('http://127.0.0.1:5000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                // Use the error message from the API if available
                throw new Error(data.message || 'Authentication failed');
            }

            toast.success('Login successful! Redirecting...', { id: toastId });

            // Store data in localStorage
            localStorage.setItem("token", data.data.token);
            localStorage.setItem("userId", data.data.userId);
            localStorage.setItem("user", JSON.stringify(data.data.user));

            if (typeof window !== 'undefined') {
                const role = data.data.user.role;
                localStorage.setItem("role", role);

                // Redirect after a short delay
                setTimeout(() => {
                    if (role === 'admin') window.location.href = '/admin/dashboard';
                    else if (role === 'superAdmin') window.location.href = '/superadmin/dashboard';
                    else window.location.href = '/';
                }, 1500);
            }
        } catch (error: any) {
            toast.error(error.message || 'An unexpected error occurred.', { id: toastId });
            console.error("Login process failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-bold text-gray-medium">Email</label>
                <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-bold text-gray-medium">Password</label>
                <Input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <a href='/auth/forgot-password' className="block text-right text-xs font-bold text-purple transition-colors hover:underline dark:text-purple-hover">
                Forgot Password?
            </a>

            <Button type="submit" variant="primary" className="!mt-4" >
                {isLoading ? 'Logging in...' : 'Login'}
            </Button>
        </form>
    );
};

export default Login;