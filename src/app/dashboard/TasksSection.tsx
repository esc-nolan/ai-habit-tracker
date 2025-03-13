"use client";

import { getUserTasks, addUserTask } from "@/lib/firebaseActions";
import { useEffect, useState } from "react";
import TaskCard from "./TaskCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

export default function TasksSection({ userId }: { userId: string }) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [newTaskDesc, setNewTaskDesc] = useState<string>("");

  // Fetch tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      const data = await getUserTasks(userId);
      setTasks(data);
    };
    fetchTasks();
  }, [userId]);

  // Handle adding new task
  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    const taskData = await addUserTask(userId, newTask.trim(), newTaskDesc.trim());
    setTasks([...tasks, taskData]);
    setNewTask(""); // Clear input field
    setNewTaskDesc(""); // Clear input field
  };

  return (
    <div className="max-w-5xl mx-auto mb-12">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium text-white">Daily Tasks</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 text-white hover:bg-zinc-800 cursor-pointer">
              <Plus className="w-4 h-4" /> Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Daily Task</DialogTitle>
            </DialogHeader>
            <Input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter task title..."
              className="mt-2"
            />

<Input
              value={newTaskDesc}
              onChange={(e) => setNewTaskDesc(e.target.value)}
              placeholder="Enter task description..."
              className="mt-2"
            />
            <Button onClick={handleAddTask} className="mt-4 w-full cursor-pointer hover:bg-zinc-800">
              Save Task
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Task List */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
