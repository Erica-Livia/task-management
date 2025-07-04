"use client";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors, closestCorners } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Board, Task } from "@/types/taskbuddy";
import { useBoardStore } from '@/store/boardStore';
import { useState } from "react";
import Column from "./Column";
import TaskCard from "./TaskCard";
import Input from './Input';
import Button from './Button';

export default function BoardView({ board }: { board: Board | null }) {
    const { setOptimisticBoard, reorderTasks, addColumn } = useBoardStore();
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [isAddingColumn, setIsAddingColumn] = useState(false);
    const [newColumnName, setNewColumnName] = useState("");

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        })
    );

    if (!board) return (
        <>
            <div className="flex flex-col h-full p-8">
                <div className="w-full rounded-lg p-10 text-center">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                        Welcome!
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Choose a board to get started.
                    </p>
                </div>
            </div>
        </>

    )

    const onDragStart = (event: DragStartEvent) => {
        if (event.active.data.current?.type === "Task") {
            setActiveTask(event.active.data.current.task);
        }
    };

    const onDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;
        const activeId = active.id;
        const overId = over.id;
        if (activeId === overId) return;

        const isActiveATask = active.data.current?.type === "Task";
        const isOverATask = over.data.current?.type === "Task";
        const isOverAColumn = over.data.current?.type === "Column";

        if (!isActiveATask) return;

        const activeColumn = board.columns.find(col => col.tasks.some(t => t.id === activeId));
        let overColumn;
        if (isOverATask) {
            overColumn = board.columns.find(col => col.tasks.some(t => t.id === overId));
        } else if (isOverAColumn) {
            overColumn = board.columns.find(col => col.id === overId);
        }

        if (!activeColumn || !overColumn || activeColumn.id === overColumn.id) {
            return;
        }

        const activeTaskIndex = activeColumn.tasks.findIndex(t => t.id === activeId);
        const [movedTask] = activeColumn.tasks.splice(activeTaskIndex, 1);
        overColumn.tasks.push(movedTask);
        const updatedBoard = { ...board, columns: [...board.columns] };
        setOptimisticBoard(updatedBoard);
    };

    const onDragEnd = (event: DragEndEvent) => {
        setActiveTask(null);
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const activeColumn = board.columns.find(col => col.tasks.some(t => t.id === active.id));
        if (activeColumn) {
            const activeTaskIndex = activeColumn.tasks.findIndex(t => t.id === active.id);
            const overTaskIndex = activeColumn.tasks.findIndex(t => t.id === over.id);
            if (activeTaskIndex !== -1 && overTaskIndex !== -1) {
                const updatedTasks = arrayMove(activeColumn.tasks, activeTaskIndex, overTaskIndex);
                const updatedBoard = {
                    ...board,
                    columns: board.columns.map(col =>
                        col.id === activeColumn.id ? { ...col, tasks: updatedTasks } : col
                    )
                };
                setOptimisticBoard(updatedBoard);
            }
        }

        const tasksToUpdate = board.columns.flatMap(col =>
            col.tasks.map((task, index) => ({
                id: task.id,
                position: index,
                columnId: col.id
            }))
        );
        reorderTasks(tasksToUpdate);
    };

    const handleAddColumn = async () => {
        if (newColumnName.trim()) {
            await addColumn(newColumnName);
            setNewColumnName("");
            setIsAddingColumn(false);
        }
    };

    return (
        <DndContext
            sensors={sensors}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
            collisionDetection={closestCorners}
        >
            <main className="flex-grow p-6 bg-gray-light dark:bg-gray-v-dark overflow-x-auto">
                <div className="flex gap-6 h-full">
                    {board.columns.map(column => (
                        <Column key={column.id} column={column} />
                    ))}
                    <div className="flex-shrink-0 w-72 mt-12">
                        {isAddingColumn ? (
                            <div className="p-4 bg-white dark:bg-gray-dark rounded-lg space-y-2">
                                <Input
                                    id="new-column"
                                    name="new-column"
                                    placeholder="e.g. In Review"
                                    value={newColumnName}
                                    onChange={(e) => setNewColumnName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddColumn()}
                                    autoFocus
                                />
                                <div className="flex gap-2">
                                    <Button onClick={handleAddColumn} variant="primary">Save</Button>
                                    <Button onClick={() => setIsAddingColumn(false)} variant="secondary">Cancel</Button>
                                </div>
                            </div>
                        ) : (
                            <div
                                onClick={() => setIsAddingColumn(true)}
                                className="flex items-center justify-center h-full bg-gray-light dark:bg-gray-dark/25 rounded-lg cursor-pointer transition-colors dark:hover:bg-gray-dark/50"
                            >
                                <span className="text-xl font-bold text-gray-medium hover:text-purple">+ New Column</span>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <DragOverlay>
                {activeTask && <TaskCard task={activeTask} />}
            </DragOverlay>
        </DndContext>
    );
}