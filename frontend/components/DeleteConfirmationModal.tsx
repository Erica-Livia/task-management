"use client";
import { useBoardStore } from '@/store/boardStore';

export default function DeleteConfirmationModal() {
    const { isDeleteModalOpen, modalType, itemToDelete, closeDeleteModal, deleteBoard, deleteColumn, deleteTask } = useBoardStore();

    if (!isDeleteModalOpen || !itemToDelete) return null;

    const handleDelete = () => {
        if (modalType === 'board') {
            deleteBoard(itemToDelete.id);
        } else if (modalType === 'column') {
            deleteColumn(itemToDelete.id);
        } else if (modalType === 'task') {
            deleteTask(itemToDelete.id);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600/90">
            <div className="bg-white dark:bg-gray-dark rounded-lg p-6 w-full max-w-md space-y-4">
                <h2 className="text-lg font-bold text-red">Delete this {modalType}?</h2>
                <p className="text-body-lg text-gray-medium">
                    Are you sure you want to delete the "{itemToDelete.name}" {modalType}? This action will remove all
                    columns and tasks and cannot be reversed.
                </p>
                <div className="flex gap-4">
                    <button onClick={handleDelete} className="flex-1 bg-red text-white p-2 rounded-full">Delete</button>
                    <button onClick={closeDeleteModal}
                            className="flex-1 bg-gray-light text-purple p-2 rounded-full dark:bg-white">Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}