"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import toast from 'react-hot-toast';
import AuthLayout from '@/components/layouts/AuthLayout';
import Button from '@/components/Button';

interface PageStatus {
    status: "verifying" | "success" | "error";
    message: string;
}

function VerifyEmailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [pageStatus, setPageStatus] = useState<PageStatus>({
        status: "verifying",
        message: "Verifying your email, please wait..."
    });

    useEffect(() => {
        if (!token) {
            setPageStatus({ status: "error", message: "Verification link is invalid or missing token." });
            return;
        }

        const verificationPromise = axios.get(`http://127.0.0.1:5000/auth/verify-email/${token}`);
        toast.promise(verificationPromise, {
            loading: 'Verifying your email...',
            success: (res) => res.data.message || 'Email verified successfully!',
            error: (err: AxiosError<{ message: string }>) => err.response?.data?.message || 'Verification failed.'
        })
            .then((res) => {
                setPageStatus({ status: "success", message: res.data.message });
                setTimeout(() => router.push("/signin"), 3000);
            })
            .catch((err: AxiosError<{ message: string }>) => {
                setPageStatus({ status: "error", message: err.response?.data?.message || "Verification failed." });
            });
    }, [token, router]);

    return (
        <AuthLayout title="Email Verification">
            <div className="text-center space-y-4">
                <h2 className="text-xl font-bold dark:text-white">
                    {pageStatus.status === 'success' && 'Success!'}
                    {pageStatus.status === 'error' && 'Verification Failed'}
                    {pageStatus.status === 'verifying' && 'Verifying...'}
                </h2>
                <p className="text-body-lg text-gray-medium">{pageStatus.message}</p>
                {pageStatus.status === 'success' && (
                    <p className="text-xs text-gray-medium">Redirecting to login...</p>
                )}
                {pageStatus.status === 'error' && (
                    <div className="pt-4">
                        <Button variant="primary" onClick={() => router.push('/signin')}>Go to Login</Button>
                    </div>
                )}
            </div>
        </AuthLayout>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyEmailContent />
        </Suspense>
    );
}