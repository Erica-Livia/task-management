"use client";
import { Board, Column as ColumnType } from "@/types/taskbuddy";
import Column from "./Column";

interface BoardViewProps {
    board: Board | null;
}

export default function BoardView({ board }: BoardViewProps) {
    if (!board) return <div className="flex-grow p-8 text-center">Select a board to view its content.</div>;

    return (
        <main className="flex-grow p-6 bg-gray-light dark:bg-gray-v-dark overflow-x-auto">
            <div className="flex gap-6 h-full">
                {board?.columns?.map((column) => (
                    <Column key={column.id} column={column} />
                ))}
                <div className="flex items-center justify-center w-72 bg-gray-light/50 dark:bg-gray-dark/50 rounded-lg mt-12 flex-shrink-0">
                    <button className="text-xl font-bold text-gray-medium hover:text-purple">+ New Column</button>
                </div>
            </div>
        </main>
    );
}