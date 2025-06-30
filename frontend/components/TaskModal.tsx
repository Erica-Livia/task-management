"use client";
import { useBoardStore } from "@/store/boardStore";
import { Subtask } from "@/types/taskbuddy";
import {useState} from "react";

const SubtaskItem = ({ subtask }: { subtask: Subtask }) => {
    const { toggleSubtask,selectedTask, activeBoard, clearSelectedTask, openDeleteModal } = useBoardStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    const { toggleSubtask,selectedTask, activeBoard, clearSelectedTask, openDeleteModal } = useBoardStore();
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

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600/90"
            onClick={handleClose}
        >
            {/* Modal Content */}
            <div className="bg-white dark:bg-gray-dark rounded-lg p-6 w-full max-w-md space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-black dark:text-white">{selectedTask.title}</h2>
                </div>

                <p className="text-body-lg text-gray-medium">{selectedTask.description || "No description for this task."}</p>

                {/* Subtasks Section */}
                {totalSubtasks > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-medium">
                            Subtasks ({completedSubtasks} of {totalSubtasks})
                        </h3>
                        <div className="space-y-2">
                            {selectedTask.subtasks.map(sub => (
                                <SubtaskItem key={sub.id} subtask={sub} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Status Dropdown */}
                <div className="space-y-2">
                    <label htmlFor="status" className="text-sm font-bold text-gray-medium">Current Status</label>
                    <select
                        id="status"
                        defaultValue={selectedTask.status}
                        className="w-full rounded-sm border border-gray-medium/25 bg-transparent px-4 py-2 text-body-lg text-black outline-none focus:border-purple dark:text-white"
                    >
                        {activeBoard.columns.map(col => (
                            <option key={col.id} value={col.name}>{col.name}</option>
                        ))}
                    </select>
                </div>
                <div className="relative">
                    <button onClick={() => setIsMenuOpen(prev => !prev)} className="p-2 text-gray-medium">
                        <svg width="5" height="20" xmlns="http://www.w3.org/2000/svg"><g fill="#828FA3" fillRule="evenodd"><circle cx="2.308" cy="2.308" r="2.308"/><circle cx="2.308" cy="10" r="2.308"/><circle cx="2.308" cy="17.692" r="2.308"/></g></svg>
                    </button>
                    {isMenuOpen && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-v-dark rounded-lg shadow-lg p-2 z-10">
                            <button className="w-full text-left p-2 text-gray-medium hover:bg-gray-light">Edit Task</button>
                            <button
                                onClick={() => {
                                    openDeleteModal('task', {
                                        id: selectedTask.id, name: selectedTask.title,
                                        columns: []
                                    });
                                    setIsMenuOpen(false);
                                }}
                                className="w-full text-left p-2 text-red hover:bg-gray-light"
                            >
                                Delete Task
                            </button>
                        </div>
                        )}
                </div>
            </div>
        </div>
    );
}