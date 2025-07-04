import React from 'react';

interface ChartCardProps {
    title: string;
    children: React.ReactNode;
}

export default function ChartCard({ title, children }: ChartCardProps) {
    return (
        <div className="bg-white dark:bg-gray-dark rounded-lg p-6 shadow-md">
            <h2 className="text-lg font-bold text-black dark:text-white mb-4">{title}</h2>
            <div>
                {children}
            </div>
        </div>
    );
}