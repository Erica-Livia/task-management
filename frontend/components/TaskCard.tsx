"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task as TaskType } from "@/types/taskbuddy";
import { useBoardStore } from "@/store/boardStore";

interface TaskCardProps {
    task: TaskType;
}

export default function TaskCard({ task }: TaskCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    }  = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task,
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const selectTask = useBoardStore((state) => state.selectTask);
    const completedSubtasks = task.subtasks.filter(sub => sub.isCompleted).length;
    const totalSubtasks = task.subtasks.length;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => selectTask(task)}
            className="bg-white dark:bg-gray-dark p-4 rounded-lg shadow-md cursor-grab group"
        >
            <h4 className="font-bold text-md text-black dark:text-white group-hover:text-purple">
                {task.title}
            </h4>
            <p className="text-body-md font-bold text-gray-medium mt-2">
                {completedSubtasks} of {totalSubtasks} subtasks
            </p>
        </div>
    );
}