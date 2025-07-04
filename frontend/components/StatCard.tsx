import React from 'react';
import {TbLayoutBoardSplit} from "react-icons/tb";

interface StatCardProps {
    title: string;
    value: number | string;
}

export default function StatCard({ title, value }: StatCardProps) {
    return (
        <div className="bg-white dark:bg-gray-dark rounded-lg p-6 shadow-md transition-transform hover:scale-105">
            <p className="text-sm font-bold text-gray-medium">{title}</p>
            <p className="text-3xl font-bold text-black dark:text-white mt-2">{value}</p>
        </div>
    );
}