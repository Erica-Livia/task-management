import React from 'react';

interface InputProps {
    type?: React.HTMLInputTypeAttribute;
    placeholder: string;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    name: string;
    id: string;
}

const Input: React.FC<InputProps> = ({
                                         type = 'text',
                                         placeholder,
                                         value,
                                         onChange,
                                         name,
                                         id
                                     }) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            name={name}
            id={id}
            className="w-full rounded-sm border border-gray-medium/25 bg-transparent px-4 py-2 text-body-lg text-black outline-none transition-colors duration-200 focus:border-purple dark:text-white"
        />
    );
};

export default Input;