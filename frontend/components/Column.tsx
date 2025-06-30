"use client";
import { useState } from 'react';
import { Column as ColumnType } from "@/types/taskbuddy";
import { useBoardStore } from '@/store/boardStore';
import TaskCard from "./TaskCard";

interface ColumnProps {
    column: ColumnType;
}

export default function Column({ column }: ColumnProps) {
    const { updateColumn, openDeleteModal } = useBoardStore();
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState(column.name);

    const handleUpdateName = () => {
        if (editedName.trim() && editedName !== column.name) {
            updateColumn(column.id, editedName);
        }
        setIsEditing(false);
    };

    return (
        <div className="w-72 flex-shrink-0">
            <div className="flex items-center justify-between gap-2 mb-6">
                {isEditing ? (
                    <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        onBlur={handleUpdateName}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleUpdateName(); if (e.key === 'Escape') setIsEditing(false); }}
                        className="w-full text-sm font-bold text-gray-medium uppercase tracking-widest bg-transparent outline-none focus:ring-1 focus:ring-purple rounded"
                        autoFocus
                    />
                ) : (
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsEditing(true)}>
                        <span className={`w-4 h-4 rounded-full bg-blue-500`}></span>
                        <h3 className="text-sm font-bold text-gray-medium uppercase tracking-widest">
                            {column.name} ({column.tasks.length})
                        </h3>
                    </div>
                )}
                <button
                    onClick={() => openDeleteModal('column', {
                        id: column.id, name: column.name,
                        columns: []
                    })}
                    className="text-red-500 text-xl font-bold p-1 rounded-full group-hover:opacity-100 transition-opacity"
                >
                    ×
                </button>
            </div>
            <div className="space-y-5 group">
                {column.tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                ))}
            </div>
        </div>
    );
}