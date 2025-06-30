import { Task as TaskType } from "@/types/taskbuddy";
import { useBoardStore } from "@/store/boardStore";

interface TaskCardProps {
    task: TaskType;
}

export default function TaskCard({ task }: TaskCardProps) {
    const selectTask = useBoardStore((state) => state.selectTask);
    const completedSubtasks = task.subtasks.filter(sub => sub.isCompleted).length;
    const totalSubtasks = task.subtasks.length;

    return (
        <div
            className="bg-white dark:bg-gray-dark p-4 rounded-lg shadow-md cursor-pointer group"
            onClick={() => selectTask(task)}
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