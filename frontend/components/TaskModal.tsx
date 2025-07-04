"use client";
import { useBoardStore } from "@/store/boardStore";
import { Subtask } from "@/types/taskbuddy";
import { useState } from "react";

const SubtaskItem = ({ subtask }: { subtask: Subtask }) => {
    const { toggleSubtask, selectedTask } = useBoardStore();

    return (
        <div className="flex items-center gap-4 bg-gray-light dark:bg-gray-v-dark p-3 rounded hover:bg-purple/25">
            <input
                type="checkbox"
                checked={subtask.isCompleted}
                onChange={() => toggleSubtask(subtask.id, selectedTask!.id)}
                className="w-4 h-4 text-purple bg-white border-gray-medium rounded focus:ring-purple dark:bg-gray-dark dark:border-gray-medium"
            />
            <label className={`text-sm font-bold ${subtask.isCompleted ? 'line-through text-gray-medium' : 'text-black dark:text-white'}`}>
                {subtask.title}
            </label>
        </div>
    );
};

export default function TaskModal() {
    const {
        selectedTask,
        activeBoard,
        clearSelectedTask,
        openDeleteModal,
        openTaskModal,
        updateTask
    } = useBoardStore();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    if (!selectedTask || !activeBoard) {
        return null;
    }

    const completedSubtasks = selectedTask.subtasks.filter(s => s.isCompleted).length;
    const totalSubtasks = selectedTask.subtasks.length;

    const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            clearSelectedTask();
        }
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newColumnId = Number(e.target.value);
        if (newColumnId) {
            updateTask(selectedTask.id, { columnId: newColumnId });
        }
    };

    const handleEditClick = () => {
        setIsMenuOpen(false);
        clearSelectedTask();
        openTaskModal(selectedTask);
    };

    const handleDeleteClick = () => {
        openDeleteModal('task', {id: selectedTask.id, name: selectedTask.title});
        setIsMenuOpen(false);
    };

    const parentColumnId = activeBoard.columns.find(c => c.tasks.some(t => t.id === selectedTask.id))?.id;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={handleClose}
        >
            <div className="bg-white dark:bg-gray-dark rounded-lg p-6 w-full max-w-md space-y-6">
                <div className="flex justify-between items-center gap-4">
                    <h2 className="text-lg font-bold text-black dark:text-white">{selectedTask.title}</h2>
                    <div className="relative">
                        <button onClick={() => setIsMenuOpen(prev => !prev)} className="p-2 text-gray-medium">
                            <svg width="5" height="20" xmlns="http://www.w3.org/2000/svg"><g fill="#828FA3" fillRule="evenodd"><circle cx="2.308" cy="2.308" r="2.308"/><circle cx="2.308" cy="10" r="2.308"/><circle cx="2.308" cy="17.692" r="2.308"/></g></svg>
                        </button>
                        {isMenuOpen && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-v-dark rounded-lg shadow-lg p-2 z-10">
                                <button onClick={handleEditClick} className="w-full text-left p-2 text-gray-medium hover:bg-gray-light dark:hover:bg-gray-dark rounded">Edit Task</button>
                                <button onClick={handleDeleteClick} className="w-full text-left p-2 text-red hover:bg-gray-light dark:hover:bg-gray-dark rounded">Delete Task</button>
                            </div>
                        )}
                    </div>
                </div>

                <p className="text-body-lg text-gray-medium">{selectedTask.description || "No description for this task."}</p>

                {totalSubtasks > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-medium">
                            Subtasks ({completedSubtasks} of {totalSubtasks})
                        </h3>
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                            {selectedTask.subtasks.map(sub => (
                                <SubtaskItem key={sub.id} subtask={sub} />
                            ))}
                        </div>
                    </div>
                )}

                {/*<div className="space-y-2">*/}
                {/*    <label htmlFor="status" className="text-sm font-bold text-gray-medium">Current Status</label>*/}
                {/*    <select*/}
                {/*        id="status"*/}
                {/*        value={parentColumnId || ''}*/}
                {/*        onChange={handleStatusChange}*/}
                {/*        className="w-full rounded-sm border border-gray-medium/25 bg-transparent px-4 py-2 text-body-lg text-black outline-none focus:border-purple dark:text-white"*/}
                {/*    >*/}
                {/*        {activeBoard.columns.map(col => (*/}
                {/*            <option key={col.id} value={col.id}>{col.name}</option>*/}
                {/*        ))}*/}
                {/*    </select>*/}
                {/*</div>*/}
            </div>
        </div>
    );
}