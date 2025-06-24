"use client";
import Link from 'next/link';
import { useBoardStore } from '@/store/boardStore';
import { Board } from '@/types/taskbuddy';

interface SidebarProps {
    activeBoardId: number;
}

export default function Sidebar({ activeBoardId }: SidebarProps) {
    const boards = useBoardStore((state) => state.boards);

    return (
        <aside className="w-64 bg-white dark:bg-gray-dark flex-shrink-0 p-4 border-r dark:border-gray-v-dark">
            <h2 className="text-sm font-bold text-gray-medium mb-4">ALL BOARDS</h2>
            <nav>
                <ul>
                    {boards.map((board) => (
                        <li key={board.id}>
                            <Link
                                href={`/board/${board.id}`}
                                className={`flex items-center gap-3 p-3 rounded-r-full mr-4 ${
                                    board.id === activeBoardId
                                        ? 'bg-purple text-white'
                                        : 'text-gray-medium hover:bg-purple/10 hover:text-purple'
                                }`}
                            >
                                {/* Board Icon SVG */}
                                <span>{board.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}