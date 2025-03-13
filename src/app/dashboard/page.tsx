// "use client";

// import { useUser } from "@/lib/auth";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Plus } from "lucide-react";
// import { db } from "@/lib/firebase";
// import { collection, addDoc, getDocs, query } from "firebase/firestore";

// export default function DashboardPage() {
//   const { user, loading } = useUser();
//   const router = useRouter();

//   const [habits, setHabits] = useState<any[]>([]);
//   const [tasks, setTasks] = useState<any[]>([]);
//   const [newHabit, setNewHabit] = useState<string>("");
//   const [newTask, setNewTask] = useState<string>("");

//   // Redirect if not logged in
//   useEffect(() => {
//     if (!loading && !user) {
//       router.push("/auth");
//     }
//   }, [user, loading, router]);

//   // Fetch user's habits and tasks
//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (user) {
//         const habitsRef = query(collection(db, "users", user.uid, "habits"));
//         const habitsSnap = await getDocs(habitsRef);
//         setHabits(habitsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

//         const tasksRef = query(collection(db, "users", user.uid, "tasks"));
//         const tasksSnap = await getDocs(tasksRef);
//         setTasks(tasksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//       }
//     };
//     fetchUserData();
//   }, [user]);

//   if (loading) return <p className="text-center p-8">Loading...</p>;
//   if (!user) return null;

//   // Add Habit
//   const handleAddHabit = async () => {
//     if (!newHabit.trim()) return;
//     const habitData = { name: newHabit.trim(), createdAt: new Date() };
//     const docRef = await addDoc(collection(db, "users", user.uid, "habits"), habitData);
//     setHabits([...habits, { id: docRef.id, ...habitData }]);
//     setNewHabit("");
//   };

//   // Add Task
//   const handleAddTask = async () => {
//     if (!newTask.trim()) return;
//     const taskData = { title: newTask.trim(), createdAt: new Date() };
//     const docRef = await addDoc(collection(db, "users", user.uid, "tasks"), taskData);
//     setTasks([...tasks, { id: docRef.id, ...taskData }]);
//     setNewTask("");
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 dark:bg-black py-10 px-4 md:px-16">

//       {/* Header */}
//       <div className="max-w-5xl mx-auto mb-8">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {user.displayName}!</h1>
//             <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
//           </div>
//           {user.photoURL && (
//             <img src={user.photoURL} alt="User Avatar" className="w-14 h-14 rounded-full border-2 border-gray-300 dark:border-gray-700" />
//           )}
//         </div>
//       </div>

//       {/* Your Habits */}
//       <div className="max-w-5xl mx-auto mb-12">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Your Streaks</h2>
//           <Dialog >
//             <DialogTrigger asChild>
//               <Button className="flex items-center gap-2 text-white">
//                 <Plus className="w-4 h-4" /> Add New Habit Streak
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="text-white">
//               <DialogHeader><DialogTitle>Add a New Habit</DialogTitle></DialogHeader>
//               <Input value={newHabit} onChange={(e) => setNewHabit(e.target.value)} placeholder="Enter habit name..." className="mt-2" />
//               <Button onClick={handleAddHabit} className="mt-4 w-full">Save Habit</Button>
//             </DialogContent>
//           </Dialog>
//         </div>

//         <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//           {habits.map((habit) => (
//             <Card key={habit.id} className="hover:shadow-lg transition">
//               <CardHeader className="text-white"><CardTitle>{habit.name}</CardTitle></CardHeader>
//               <CardContent><p className="text-sm text-gray-600 dark:text-gray-400">Added on: {habit.createdAt.toDate?.().toLocaleDateString() || "N/A"}</p></CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>

//       {/* Daily Tasks */}
//       <div className="max-w-5xl mx-auto mb-12">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Your Habits</h2>
//           <Dialog>
//             <DialogTrigger asChild>
//               <Button className="flex items-center gap-2 text-white">
//                 <Plus className="w-4 h-4" /> Add New HAbit
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="text-white">
//               <DialogHeader><DialogTitle>Add a New Task</DialogTitle></DialogHeader>
//               <Input value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Enter task..." className="mt-2" />
//               <Button onClick={handleAddTask} className="mt-4 w-full">Save Task</Button>
//             </DialogContent>
//           </Dialog>
//         </div>

//         <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//           {tasks.map((task) => (
//             <Card key={task.id} className="hover:shadow-lg transition">
//               <CardHeader className="text-white"><CardTitle>{task.title}</CardTitle></CardHeader>
//               <CardContent><p className="text-sm text-gray-600 dark:text-gray-400">Added on: {task.createdAt.toDate?.().toLocaleDateString() || "N/A"}</p></CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>

//       {/* AI Suggestions Placeholder */}
//       <div className="max-w-5xl mx-auto">
//         <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">AI Suggestions</h2>
//         <Card>
//           <CardContent className="p-6">
//             <p className="text-gray-700 dark:text-gray-300">
//               Personalized habit suggestions powered by AI will appear here soon. Stay tuned!
//             </p>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
"use client";

import AISuggestions from "@/elements/aisuggestions";
import HabitsSection from "./HabitsSection";
import TasksSection from "./TasksSection";
import { useUser } from "@/lib/auth"; // Your existing auth hook
import ChatSection from "@/elements/ChatSection";
import DraggableTodoList from "@/elements/DraggableTodoList";
import SignOutButton from "@/elements/SignOutButton";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, loading } = useUser();
  const router = useRouter(); // ✅ Initialize router

  // ✅ Handle redirect to /auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  if (loading) return <p className="">Loading...</p>;
  if (!user) return null;

  return (
    <div className="p-4 bg-black text-white h-screen ">
      <div className="max-w-7xl mx-auto mb-12 flex justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Hi, {user.displayName?.split(" ")[0]}!
          </h1>
          <p className="text-sm text-gray-400">{user.email}</p>
        </div>

<div className="flex items-center gap-4">
{user.photoURL && (
          <img
            src={user.photoURL}
            alt="User Avatar"
            className="w-10 h-10 rounded-full border-2 border-gray-300 dark:border-gray-700"
          />
        )}
<SignOutButton />
</div>
       
      </div>
      <div className="max-w-7xl mx-auto h-px bg-gray-300 my-4 mb-12" />


      <div className="flex justify-around max-w-7xl mx-auto">
        <div>
          <DraggableTodoList />

          {/* Your Habit Section */}
          <HabitsSection userId={user.uid} />

          {/* Daily Tasks Section */}
          <TasksSection userId={user.uid} />
        </div>

        <div className="ml-8">
          {/* AI Suggestions Placeholder */}
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-xl font-medium mb-4">Todo Chatbot</h2>
            {/* <p className="text-gray-400">Coming soon...</p> */}
            {/* AI Suggestions */}
            <ChatSection />
          </div>
        </div>
      </div>
    </div>
  );
}
