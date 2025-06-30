import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'toggleActive' | 'toggleInactive';

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
    const baseClasses = 'w-full rounded-md px-4 py-2 text-sm font-bold transition-colors duration-200 disabled:opacity-50';

    const variants: Record<ButtonVariant, string> = {
        primary: 'bg-purple text-white hover:bg-purple-hover',
        secondary: 'bg-white text-purple hover:bg-gray-light dark:bg-white dark:hover:bg-white/90',
        destructive: 'bg-red text-white hover:bg-red-hover',
        toggleActive: 'bg-purple text-white',
        toggleInactive: 'bg-gray-light text-gray-medium hover:bg-purple/25 dark:bg-gray-v-dark dark:text-white dark:hover:bg-white/20'
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