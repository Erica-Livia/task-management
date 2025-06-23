"use client";
import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import toast from 'react-hot-toast';
import AuthLayout from '@/components/layouts/AuthLayout';
import Button from '@/components/Button';
import Input from '@/components/Input';

function Form() {
    const [formData, setFormData] = useState({ newPassword: '', confirmNewPassword: '' });
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmNewPassword) {
            toast.error("Passwords do not match.");
            return;
        }
        if (!token) {
            toast.error("Invalid or missing reset token.");
            return;
        }

        setIsLoading(true);
        const toastId = toast.loading("Updating your password...");
        try {
            await axios.post(`http://127.0.0.1:5000/auth/reset-password/${token}`, { newPassword: formData.newPassword });
            toast.success("Password updated! Redirecting...", { id: toastId });
            setTimeout(() => router.push("/login"), 3000);
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            toast.error(error.response?.data?.message || "Failed to reset. Link may have expired.", { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout title="Reset Your Password">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-medium">New Password</label>
                    <Input type="password" name="newPassword" placeholder="Enter a new, strong password" value={formData.newPassword} onChange={handleChange} id="new-password"/>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-medium">Confirm New Password</label>
                    <Input type="password" name="confirmNewPassword" placeholder="Confirm your new password" value={formData.confirmNewPassword} onChange={handleChange} id="confirm-new-password"/>
                </div>
                <Button type="submit" variant="primary">
                    {isLoading ? "Changing..." : "Change Password"}
                </Button>
            </form>
        </AuthLayout>
    );
}


export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Form />
        </Suspense>
    );
}