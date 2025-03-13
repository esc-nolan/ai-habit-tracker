'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, CheckCircle, Circle } from 'lucide-react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useUser } from '@/lib/auth';
import { getUserTodosForDate, saveUserTodosForDate } from '@/lib/firebaseActions';
import { format } from 'date-fns';

interface Todo {
  id: string;
  title: string;
  time: string;
  completed: boolean;
}

export default function DraggableTodoList() {
  const { user } = useUser();
  const userId = user?.uid;

  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [newTime, setNewTime] = useState('');

  const today = format(new Date(), 'yyyy-MM-dd');

  // ✅ Fetch todos when user is available
  useEffect(() => {
    if (!userId) return;
    const fetchTodos = async () => {
      const fetchedTodos = await getUserTodosForDate(userId, today);
      setTodos(fetchedTodos);
    };
    fetchTodos();
  }, [userId, today]);

  // ✅ Save todos to Firebase
  const saveTodos = async (updatedTodos: Todo[]) => {
    if (userId) {
      await saveUserTodosForDate(userId, today, updatedTodos);
    }
  };

  // ✅ Add Todo
  const handleAddTodo = async () => {
    if (!newTodo.trim() || !newTime.trim()) return;
    const updatedTodos = [
      ...todos,
      { id: Date.now().toString(), title: newTodo.trim(), time: newTime.trim(), completed: false },
    ];
    setTodos(updatedTodos);
    setNewTodo('');
    setNewTime('');
    await saveTodos(updatedTodos);
  };

  // ✅ Toggle Completion with separate button/icon
  const toggleComplete = (id: string) => {
    setTodos((prevTodos) => {
      const updatedTodos = prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
      saveTodos(updatedTodos); // Save in background
      return updatedTodos;
    });
  };

  // ✅ Handle Drag End
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = todos.findIndex((t) => t.id === active.id);
      const newIndex = todos.findIndex((t) => t.id === over.id);
      const reordered = arrayMove(todos, oldIndex, newIndex);
      setTodos(reordered);
      saveTodos(reordered);
    }
  };

  // ✅ Prevent rendering when user is not loaded
  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto bg-black rounded-xl shadow-lg space-y-4 mb-12">
      <h2 className="text-xl font-medium text-gray-100">Today To-Dos</h2>

      {/* Input for new todo */}
      <div className="flex gap-2">
        <Input
          type="time"
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
          className="bg-zinc-800 text-white border-zinc-700"
        />
        <Input
          type="text"
          placeholder="New To-Do"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="bg-zinc-800 text-white border-zinc-700"
        />
        <Button onClick={handleAddTodo} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Draggable List */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={todos.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {todos.map((todo) => (
              <SortableTodo key={todo.id} todo={todo} toggleComplete={toggleComplete} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

// ✅ Sortable Todo Component with separate complete button
function SortableTodo({
  todo,
  toggleComplete,
}: {
  todo: Todo;
  toggleComplete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex items-center justify-between gap-3 p-3 rounded-lg border cursor-pointer transition ${
        todo.completed
          ? 'bg-zinc-700 border-zinc-700 text-zinc-400'
          : 'bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-sm">{todo.time}</span>
        <span className={`text-sm ${todo.completed ? 'line-through' : ''}`}>{todo.title}</span>
      </div>
      <button onClick={() => toggleComplete(todo.id)} className="ml-auto">
        {todo.completed ? (
          <CheckCircle className="w-5 h-5 text-green-500" />
        ) : (
          <Circle className="w-5 h-5 text-gray-400" />
        )}
      </button>
    </div>
  );
}
