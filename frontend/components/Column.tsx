"use client";
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Column as ColumnType } from "@/types/taskbuddy";
import TaskCard from "./TaskCard";
import { useState } from 'react';
import { useBoardStore } from '@/store/boardStore';

export default function Column({ column }: { column: ColumnType }) {
    const { setNodeRef, isOver } = useDroppable({
        id: column.id,
        data: {
            type: "Column"
        }
    });

    const droppableClasses = isOver
        ? "border-2 border-dashed border-purple"
        : "border-2 border-dashed border-transparent";

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
            <div className="flex items-center justify-between gap-2 mb-6 group">
                {isEditing ? (
                    <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        onBlur={handleUpdateName}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleUpdateName();
                            if (e.key === 'Escape') setIsEditing(false);
                        }}
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
                    onClick={() => openDeleteModal('column', {id: column.id, name: column.name})}
                    className="text-gray-medium hover:text-red text-xl font-bold p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    ×
                </button>
            </div>

            <div
                ref={setNodeRef}
                className={`space-y-5 h-full p-2 min-h-[200px] rounded-lg transition-colors duration-200 ${droppableClasses}`}
            >
                <SortableContext items={column.tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {column.tasks.map((task) => (
                        <TaskCard key={task.id} task={task}/>
                    ))}
                </SortableContext>
            </div>
        </div>
    );
}