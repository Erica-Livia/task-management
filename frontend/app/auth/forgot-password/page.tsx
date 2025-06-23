"use client";
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import toast from 'react-hot-toast';
import AuthLayout from '@/components/layouts/AuthLayout';
import Button from '@/components/Button';
import Input from '@/components/Input';

function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const toastId = toast.loading('Sending reset link...');

        try {
            const res = await axios.post('http://127.0.0.1:5000/auth/forgot-password', { email });
            if (res.status === 200) {
                toast.success(res.data.message || "Reset link sent!", { id: toastId });
                setIsSuccess(true);
                setTimeout(() => router.push("/signin"), 10000);
            }
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            toast.error(error.response?.data?.message || "Failed to send reset link.", { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout title="Password Reset">
            {!isSuccess ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-bold text-gray-medium">
                            Enter your email to receive a reset link
                        </label>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="e.g. alex@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <Button type="submit" variant="primary">
                        {isLoading ? "Sending..." : "Send Reset Link"}
                    </Button>
                </form>
            ) : (
                <div className="text-center space-y-4">
                    <p className="text-body-lg text-gray-medium">
                        Request received! If an account with that email exists, we've sent instructions to reset your password.
                    </p>
                    <p className="text-xs text-gray-medium">
                        You will be redirected to the login page shortly.
                    </p>
                </div>
            )}
        </AuthLayout>
    );
}

export default ForgotPasswordPage;