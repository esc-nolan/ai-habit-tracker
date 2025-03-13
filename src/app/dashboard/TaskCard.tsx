import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import TaskDetailModal from "./TaskDetailModal";

interface TaskCardProps {
  task: { id: string; title: string; completionHistory: Record<string, boolean>; createdAt: string; desc: string  };
}

export default function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="mb-2">
      <Dialog>
      <DialogTrigger asChild>
        <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-700 hover:bg-zinc-800 cursor-pointer">
          <div className="flex justify-between items-center">
            <span className="text-white font-extralight">{task.title}</span>
            <div className="flex gap-1">
              {Object.values(task.completionHistory || {}).slice(-10).map((done, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-sm border ${
                    done ? "bg-green-500 border-green-500" : "border-zinc-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </DialogTrigger>

      <TaskDetailModal task={task} />
    </Dialog>
    </div>
    
  );
}
