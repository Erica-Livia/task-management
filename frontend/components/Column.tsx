import { Column as ColumnType, Task as TaskType } from "@/types/taskbuddy";
import TaskCard from "./TaskCard";

interface ColumnProps {
    column: ColumnType;
}

export default function Column({ column }: ColumnProps) {
    const color = 'bg-blue-500';

    return (
        <div className="w-72 flex-shrink-0">
            <div className="flex items-center gap-2 mb-6">
                <span className={`w-4 h-4 rounded-full ${color}`}></span>
                <h3 className="text-sm font-bold text-gray-medium uppercase tracking-widest">
                    {column.name} ({column.tasks.length})
                </h3>
            </div>
            <div className="space-y-5">
                {column.tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                ))}
            </div>
        </div>
    );
}