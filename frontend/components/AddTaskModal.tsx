"use client";
import { useState, useEffect } from 'react';
import { useBoardStore } from '@/store/boardStore';
import Button from '@/components/Button';
import Input from '@/components/Input';

export default function AddEditTaskModal() {
    const {
        isTaskModalOpen,
        closeTaskModal,
        addTask,
        updateTask,
        activeBoard,
        editingTask
    } = useBoardStore();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [subtasks, setSubtasks] = useState<{ id?: number; title: string }[]>([]);
    const [status, setStatus] = useState<number>(0);

    useEffect(() => {
        if (isTaskModalOpen) {
            if (editingTask) {
                const parentColumn = activeBoard?.columns.find(c =>
                    c.tasks.some(t => t.id === editingTask.id)
                );
                setTitle(editingTask.title);
                setDescription(editingTask.description || '');
                setSubtasks(editingTask.subtasks.map(s => ({ id: s.id, title: s.title })));
                setStatus(parentColumn?.id || 0);
            } else {
                setTitle('');
                setDescription('');
                setSubtasks([{ title: '' }, { title: '' }]);
                if (activeBoard?.columns && activeBoard.columns.length > 0) {
                    setStatus(activeBoard.columns[0].id);
                }
            }
        }
    }, [isTaskModalOpen, editingTask, activeBoard]);


    const handleSubtaskChange = (index: number, value: string) => {
        const newSubtasks = [...subtasks];
        newSubtasks[index].title = value;
        setSubtasks(newSubtasks);
    };

    const addSubtask = () => setSubtasks([...subtasks, { title: '' }]);
    const removeSubtask = (index: number) => setSubtasks(subtasks.filter((_, i) => i !== index));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !status) {
            return;
        }

        if (editingTask) {
            const subtasksForUpdate = subtasks.filter(s => s.title.trim() !== '');
            await updateTask(editingTask.id, {
                title,
                description,
                columnId: status,
                subtasks: subtasksForUpdate,
            });
        } else {
            const subtaskTitles = subtasks
                .map(s => s.title)
                .filter(title => title.trim() !== '');
            await addTask({
                title,
                description,
                columnId: status,
                subtasks: subtaskTitles,
            });
        }
    };

    if (!isTaskModalOpen || !activeBoard) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={(e) => { if (e.target === e.currentTarget) closeTaskModal(); }}
        >
            <div className="bg-white dark:bg-gray-dark rounded-lg p-6 w-full max-w-md space-y-4">
                <h2 className="text-lg font-bold">{editingTask ? 'Edit Task' : 'Add New Task'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-medium">Title</label>
                        <Input id="task-title" name="task-title" placeholder="e.g. Take coffee break" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-medium">Description</label>
                        <textarea
                            placeholder="e.g. It’s always good to take a break. This 15 minute break will recharge the batteries a little."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full h-28 rounded-sm border border-gray-medium/25 bg-transparent p-4 text-body-lg text-black outline-none focus:border-purple dark:text-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-medium">Subtasks</label>
                        {subtasks.map((sub, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <Input id={`sub-${index}`} name={`sub-${index}`} placeholder="e.g. Make coffee" value={sub.title} onChange={(e) => handleSubtaskChange(index, e.target.value)} />
                                <button type="button" onClick={() => removeSubtask(index)} className="text-gray-medium text-xl font-bold hover:text-red">×</button>
                            </div>
                        ))}
                        <Button type="button" variant="secondary" onClick={addSubtask}>+ Add New Subtask</Button>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-medium">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(Number(e.target.value))}
                            className="w-full rounded-sm border border-gray-medium/25 bg-transparent px-4 py-2 text-body-lg text-black outline-none focus:border-purple dark:text-white"
                        >
                            {activeBoard.columns.map(col => (
                                <option key={col.id} value={col.id}>{col.name}</option>
                            ))}
                        </select>
                    </div>
                    <Button type="submit" variant="primary">{editingTask ? 'Save Changes' : 'Create Task'}</Button>
                </form>
            </div>
        </div>
    );
}