"use client";
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import StatCard from '@/components/StatCard';
import ChartCard from '@/components/ChartCard';
import TasksByStatusChart from '@/components/TasksByStatusChart';
import { useAuth } from '@/hooks/useAuth';
import api from '@/services/api';
import Sidebar from "@/components/Sidebar";
import {useParams} from "next/navigation";

interface UserStats {
    totalBoards: number;
    totalTasks: number;
    completedTasks: number;
    tasksByStatus: { status: string; count: string }[];
}

export default function DashboardPage() {
    const { user, handleLogout } = useAuth();
    const [stats, setStats] = useState<UserStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const params = useParams();
    const boardId = parseInt(params.boardId as string, 10);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setIsLoading(true);
                const response = await api.get('/stats');
                setStats(response.data.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);

            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchStats();
        }
    }, [user]);

    if (isLoading || !stats) {
        return (
            <div className="flex flex-col h-screen bg-gray-light dark:bg-gray-v-dark font-sans">
                <Header user={user} onLogout={handleLogout} />
                <div className="text-center p-10 text-gray-medium">Loading Dashboard...</div>
            </div>
        );
    }

    const chartData = stats.tasksByStatus.map(item => ({
        status: item.status,
        count: parseInt(item.count, 10),
    }));

    return (
        <div className="flex h-screen bg-gray-light dark:bg-gray-v-dark font-sans">
            <Sidebar activeBoardId={boardId} />
            <main className="flex-grow p-6 overflow-y-auto">
                <div className="container mx-auto">
                    <h1 className="text-xl font-bold text-black dark:text-white mb-6">Your productivity statistics</h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <StatCard title="Total Boards" value={stats.totalBoards} />
                        <StatCard title="Total Tasks" value={stats.totalTasks} />
                        <StatCard title="Completed Tasks" value={stats.completedTasks} />
                    </div>

                    <div className="flex items-center justify-center w-[80%]">
                            <ChartCard title="Tasks by Status">
                                <TasksByStatusChart data={chartData} />
                            </ChartCard>
                    </div>
                </div>
            </main>
        </div>
    );
}