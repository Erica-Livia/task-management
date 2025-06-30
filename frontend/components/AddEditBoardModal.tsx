"use client";
import { useState, useEffect } from 'react';
import { useBoardStore } from '@/store/boardStore';
import { useRouter } from 'next/navigation';


export default function AddEditBoardModal() {
    const { isBoardModalOpen, editingBoard, closeBoardModal, createBoard, updateBoard } = useBoardStore();
    const [name, setName] = useState('');
    const [columns, setColumns] = useState<{ id?: number; name: string }[]>([]);
    const router = useRouter();
    useEffect(() => {
        if (isBoardModalOpen && editingBoard) {
            setName(editingBoard.name);
            setColumns(editingBoard.columns.map(c => ({ id: c.id, name: c.name })));
        } else {
            setName('');
            setColumns([{ name: 'Todo' }, { name: 'Doing' }]);
        }
    }, [isBoardModalOpen, editingBoard]);

    const handleColumnChange = (index: number, value: string) => {
        const newColumns = [...columns];
        newColumns[index].name = value;
        setColumns(newColumns);
    };

    const addColumn = () => setColumns([...columns, { name: '' }]);
    const removeColumn = (index: number) => setColumns(columns.filter((_, i) => i !== index));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingBoard) {
            await updateBoard(editingBoard.id, { name, columns });
        } else {
            const newBoard = await createBoard({ name, columns: columns.map(c => c.name) });
            if (newBoard) {
             router.push(`/boards/${newBoard.id}`)
            }
        }
        closeBoardModal();
    };

    if (!isBoardModalOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600/90">
            <div className="bg-white dark:bg-gray-dark rounded-lg p-6 w-full max-w-md space-y-4">
                <h2 className="text-lg font-bold">{editingBoard ? 'Edit Board' : 'Add New Board'}</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Board Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Web Design" required />
                    </div>
                    <div>
                        <label>Board Columns</label>
                        {columns.map((col, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input type="text" value={col.name} onChange={(e) => handleColumnChange(index, e.target.value)} required />
                                <button type="button" onClick={() => removeColumn(index)}>X</button>
                            </div>
                        ))}
                        <button type="button" onClick={addColumn}>+ Add New Column</button>
                    </div>
                    <button type="submit">{editingBoard ? 'Save Changes' : 'Create New Board'}</button>
                </form>
            </div>
        </div>
    );
}