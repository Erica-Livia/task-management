"use client";
import { useState } from 'react';
import { Board } from "@/types/taskbuddy";
import { useBoardStore } from '@/store/boardStore';
import Column from "./Column";
import Input from './Input';
import Button from './Button';

interface BoardViewProps {
    board: Board | null;
}

export default function BoardView({ board }: BoardViewProps) {
    const { addColumn } = useBoardStore();
    const [isAddingColumn, setIsAddingColumn] = useState(false);
    const [newColumnName, setNewColumnName] = useState("");

    if (!board) return <div className="flex-grow p-8 text-center">Select a board to view its content.</div>;

    const handleAddColumn = async () => {
        if (newColumnName.trim()) {
            await addColumn(newColumnName);
            setNewColumnName("");
            setIsAddingColumn(false);
        }
    };

    return (
        <main className="flex-grow p-6 bg-gray-light dark:bg-gray-v-dark overflow-x-auto">
            <div className="flex gap-6 h-full">
                {board?.columns?.map((column) => (
                    <Column key={column.id} column={column} />
                ))}

                <div className="flex-shrink-0 w-72 mt-12">
                    {isAddingColumn ? (
                        <div className="p-4 bg-white dark:bg-gray-dark rounded-lg space-y-2">
                            <Input
                                id="new-column"
                                placeholder="e.g. In Review"
                                value={newColumnName}
                                onChange={(e) => setNewColumnName(e.target.value)}
                                onKeyDown={(e: any) => e.key === 'Enter' && handleAddColumn()}
                                autoFocus
                             name={"Column title"}/>
                            <div className="flex gap-2">
                                <Button onClick={handleAddColumn} variant="primary">Save</Button>
                                <Button onClick={() => setIsAddingColumn(false)} variant="secondary">Cancel</Button>
                            </div>
                        </div>
                    ) : (
                        <div
                            onClick={() => setIsAddingColumn(true)}
                            className="flex items-center justify-center h-full bg-gray-light/50 dark:bg-gray-dark/50 rounded-lg cursor-pointer"
                        >
                            <span className="text-xl font-bold text-gray-medium hover:text-purple">+ New Column</span>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}