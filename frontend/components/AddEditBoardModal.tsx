"use client";
import { useState, useEffect } from 'react';
import { useBoardStore } from '@/store/boardStore';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import Input from '@/components/Input';

const DeleteIcon = () => (
    <svg width="15" height="15" xmlns="http://www.w3.org/2000/svg">
        <g fill="#828FA3" fillRule="evenodd">
            <path d="m12.728 0 2.122 2.122-4.95 4.95 4.95 4.95-2.122 2.122L7.778 9.192l-4.95 4.95L0 11.97l4.95-4.95L0 2.122 2.122 0l4.95 4.95z"/>
        </g>
    </svg>
);


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
    const removeColumn = (index: number) => {
        if (columns.length > 1) {
            setColumns(columns.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingBoard) {
            await updateBoard(editingBoard.id, { name, columns });
        } else {
            const newBoard = await createBoard({ name, columns: columns.map(c => c.name).filter(Boolean) });
            if (newBoard) {
                router.push(`/board/${newBoard.id}`);
            }
        }
        closeBoardModal();
    };

    if (!isBoardModalOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={(e) => { if(e.target === e.currentTarget) closeBoardModal(); }}
        >
            <div className="bg-white dark:bg-gray-dark rounded-lg p-6 w-full max-w-md space-y-6">
                <h2 className="text-lg font-bold text-black dark:text-white">
                    {editingBoard ? 'Edit Board' : 'Add New Board'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="board-name" className="text-sm font-bold text-gray-medium">Board Name</label>
                        <Input
                            id="board-name"
                            name="board-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Web Design"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-medium">Board Columns</label>
                        <div className="space-y-3">
                            {columns.map((col, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <Input
                                        id={`col-${index}`}
                                        name={`col-${index}`}
                                        type="text"
                                        value={col.name}
                                        onChange={(e) => handleColumnChange(index, e.target.value)}
                                     placeholder={""}/>
                                    <button
                                        type="button"
                                        onClick={() => removeColumn(index)}
                                        className="text-gray-medium hover:text-red transition-colors"
                                    >
                                        <DeleteIcon />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <Button type="button" variant="secondary" onClick={addColumn} className="w-full mt-3">
                            + Add New Column
                        </Button>
                    </div>

                    <Button type="submit" variant="primary" className="w-full">
                        {editingBoard ? 'Save Changes' : 'Create New Board'}
                    </Button>
                </form>
            </div>
        </div>
    );
}