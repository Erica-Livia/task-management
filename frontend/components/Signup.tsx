"use client";
import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import Button from './Button';
import Input from './Input';

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    conditions: boolean;
}

interface ApiError {
    message: string;
}

const Signup: React.FC = () => {
    const initialFormData: FormData = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        conditions: false,
    };
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!formData.conditions) {
            toast.error('You must agree to the terms and conditions');
            setIsSubmitting(false);
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            setIsSubmitting(false);
            return;
        }

        const { firstName, lastName, email, password} = formData;
        const name = `${firstName} ${lastName}`;

        const signupPromise = axios.post('http://127.0.0.1:5000/auth/signup', { name, email, password });

        toast.promise(signupPromise, {
            loading: 'Creating your account...',
            success: (res) => {
                setFormData(initialFormData); // Reset form on success
                return res.data.message || "Signup successful! Please check your email.";
            },
            error: (err: AxiosError<ApiError>) => {
                return err.response?.data?.message || 'Signup failed. Please try again.';
            }
        }).finally(() => {
            setIsSubmitting(false);
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input fields */}
            <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-bold text-gray-medium">First Name</label>
                <Input type="text" id="firstName" name="firstName" placeholder="Your first name" value={formData.firstName} onChange={handleChange} />
            </div>
            <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-bold text-gray-medium">Last Name</label>
                <Input type="text" id="lastName" name="lastName" placeholder="Your last name" value={formData.lastName} onChange={handleChange} />
            </div>
            <div className="space-y-2">
                <label htmlFor="email-signup" className="text-sm font-bold text-gray-medium">Email</label>
                <Input type="email" id="email-signup" name="email" placeholder="example@email.com" value={formData.email} onChange={handleChange} />
            </div>
            <div className="space-y-2">
                <label htmlFor="password-signup" className="text-sm font-bold text-gray-medium">Password</label>
                <Input type="password" id="password-signup" name="password" placeholder="Create a strong password" value={formData.password} onChange={handleChange} />
            </div>
            <div className="space-y-2">
                <label htmlFor="confirmPassword-signup" className="text-sm font-bold text-gray-medium">Confirm Password</label>
                <Input type="password" id="confirmPassword-signup" name="confirmPassword" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} />
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-start space-x-3 pt-2">
                <input
                    id="conditions"
                    name="conditions"
                    type="checkbox"
                    checked={formData.conditions}
                    onChange={handleChange}
                    className="h-4 w-4 mt-1 rounded border-gray-medium/25 bg-transparent text-purple focus:ring-purple"
                />
                <label htmlFor="conditions" className="text-body-lg text-gray-medium">
                    By ticking this box, I certify that I have read and understood the terms & conditions of this platform.
                </label>
            </div>

            <Button type="submit" variant="primary" className="!mt-6">
                {isSubmitting ? 'Registering...' : 'Create Account'}
            </Button>
        </form>
    );
};

export default Signup;