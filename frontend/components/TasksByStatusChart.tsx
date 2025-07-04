"use client";
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ChartData {
    status: string;
    count: number;
}

interface TasksByStatusChartProps {
    data: ChartData[];
}

export default function TasksByStatusChart({ data }: TasksByStatusChartProps) {
    const chartData = {
        labels: data.map(d => d.status),
        datasets: [
            {
                label: '# of Tasks',
                data: data.map(d => d.count),
                backgroundColor: [
                    'rgba(168, 164, 255, 0.6)', // purple.hover
                    'rgba(99, 95, 199, 0.6)',  // purple.DEFAULT
                    'rgba(234, 85, 85, 0.6)',   // red.DEFAULT
                ],
                borderColor: [
                    '#A8A4FF',
                    '#635FC7',
                    '#EA5555',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: document.documentElement.classList.contains('dark') ? '#FFFFFF' : '#828FA3',
                    font: {
                        size: 14,
                        weight: 'bold' as const
                    }
                }
            },
        },
    };

    return <Doughnut data={chartData} options={options} />;
}