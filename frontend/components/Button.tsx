import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'toggleActive' | 'toggleInactive' | 'addnew';

interface ButtonProps {
    children: React.ReactNode,
    onClick?: React.MouseEventHandler<HTMLButtonElement>,
    type?: 'button' | 'submit' | 'reset',
    variant?: ButtonVariant,
    className?: string,
    disabled?: boolean
}

const Button: React.FC<ButtonProps> = ({
                                           children,
                                           onClick,
                                           type = 'button',
                                           variant = 'primary',
                                           className = '',
                                           disabled
                                       }) => {
    const baseClasses = 'w-full px-4 py-2 text-sm font-bold transition-colors duration-200 disabled:opacity-50';

    const variants: Record<ButtonVariant, string> = {
        primary: 'bg-purple text-white hover:bg-purple-hover rounded-md',
        secondary: 'bg-white text-purple hover:bg-gray-light dark:bg-white dark:hover:bg-white/90 rounded-md',
        destructive: 'bg-red text-white hover:bg-red-hover rounded-md',
        toggleActive: 'bg-purple text-white rounded-md',
        toggleInactive: 'bg-gray-light text-gray-medium hover:bg-purple/25 dark:bg-gray-v-dark dark:text-white dark:hover:bg-white/20 rounded-md',
        addnew: 'bg-purple text-white hover:bg-purple-hover rounded-full py-4'
    };

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${baseClasses} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;