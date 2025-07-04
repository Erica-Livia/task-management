"use client";
import Link from 'next/link';
import { useBoardStore } from '@/store/boardStore';
import { Board } from '@/types/taskbuddy';
import React from "react";
import { TbLayoutBoardSplit } from "@/node_modules/react-icons/tb";
import {MdLeaderboard} from "react-icons/md";


interface SidebarProps {
    activeBoardId: number;
}

const TaskBuddyLogo: React.FC = () => (
    <svg width="24" height="25" viewBox="0 0 24 25" xmlns="http://www.w3.org/2000/svg">
        <rect width="6" height="25" rx="2" fill="#635FC7"/>
        <rect opacity="0.75" x="9" width="6" height="25" rx="2" fill="#635FC7"/>
        <rect opacity="0.5" x="18" width="6" height="25" rx="2" fill="#635FC7"/>
    </svg>
);

export default function Sidebar({ activeBoardId }: SidebarProps) {
    const boards = useBoardStore((state) => state.boards);
    const openBoardModal = useBoardStore(state => state.openBoardModal);
    return (
        <aside className="w-64 bg-white  flex-shrink-0 py-5 pt-6 border-r border-gray-light shadow-2xl">
            <Link href="/dashboard" className="flex items-center gap-2 pb-13 pl-4">
                <TaskBuddyLogo/>
                <span className="text-xl font-bold text-black dark:text-white">Task Buddy</span>
            </Link>
            {/*<h2 className="text-sm font-bold text-gray-medium mb-4">ALL BOARDS</h2>*/}
            <nav>
                <ul>
                    <h2 className="text-center gap-3 py-3 rounded-r-full mr-4 text-purple font-bold">All Boards</h2>
                    {boards.map((board) => (
                        <li key={board.id}>

                            <Link
                                href={`/board/${board.id}`}
                                className={`flex items-center gap-3 p-4 rounded-r-full mr-4 ${
                                    board.id === activeBoardId
                                        ? 'bg-purple text-white'
                                        : 'text-gray-medium hover:bg-purple/10 hover:text-purple'
                                }`}
                            >
                                <TbLayoutBoardSplit/>
                                <span>{board.name}</span>
                            </Link>
                        </li>
                    ))}
                    <button onClick={() => openBoardModal()}
                            className="flex items-center gap-3 p-4 rounded-r-full mr-4 text-purple font-extrabold">
                        <TbLayoutBoardSplit/>
                        <span>+ Create New Board</span>
                    </button>
                    <Link
                        href={`/dashboard`}
                        className="flex items-center gap-3 p-4 rounded-r-full mr-4 text-purple font-extrabold"
                    >
                        <MdLeaderboard />
                        <span>View your statistics</span>
                    </Link>


                </ul>
            </nav>
        </aside>
    );
}