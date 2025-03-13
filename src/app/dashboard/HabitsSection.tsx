"use client";

import { getUserHabits, handleAddHabit } from "@/lib/firebaseActions";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import HabitWheel from "@/elements/HabitWheel";
import { deleteHabit } from "@/lib/firebaseActions"; // Add this in your firebaseActions.ts

export default function HabitsSection({ userId }: { userId: string }) {
  const [habits, setHabits] = useState<any[]>([]);
  const [newHabit, setNewHabit] = useState<string>("");
  const [streakDays, setStreakDays] = useState<number>(30); // default streak length

  useEffect(() => {
    const fetchHabits = async () => {
      const data = await getUserHabits(userId);
      setHabits(data);
    };
    fetchHabits();
  }, [userId]);

  const handleSaveHabit = async () => {
    if (newHabit.trim() === "") return;
    await handleAddHabit(userId, newHabit, streakDays);
    setNewHabit("");
    setStreakDays(30); // reset
    const updated = await getUserHabits(userId); // refresh habits
    setHabits(updated);
  };

  const handleDeleteHabit = async (habitId: string) => {
    await deleteHabit(userId, habitId);
    const updated = await getUserHabits(userId); // refresh after deletion
    setHabits(updated);
  };

  return (
    <div className="max-w-5xl mx-auto mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium text-gray-800 dark:text-gray-100">
          Your Streaks
        </h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 text-white hover:bg-zinc-800 cursor-pointer">
              <Plus className="w-4 h-4" /> Add New Habit Streak
            </Button>
          </DialogTrigger>

          <DialogContent className="text-white">
            <DialogHeader>
              <DialogTitle>Add a New Habit</DialogTitle>
            </DialogHeader>
            <Input
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              placeholder="Enter habit name..."
              className="mt-2"
            />
            <Input
              type="number"
              value={streakDays}
              onChange={(e) => setStreakDays(Number(e.target.value))}
              placeholder="Number of days (e.g., 30)"
              className="mt-2"
            />
            <Button
              onClick={handleSaveHabit}
              className="mt-4 w-full hover:bg-zinc-800 cursor-pointer"
            >
              Save Habit
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Habit Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {habits.map((habit) => (
          <Card
            key={habit.id}
            className="hover:shadow-lg transition relative flex flex-row justify-between items-center"
          >
            {/* <CardHeader className="text-white text-m font-extralight">
              <CardTitle>{habit.name}</CardTitle>

            </CardHeader> */}

            {/* Delete Icon */}

            <div className="">
              <CardContent className="mb-2 flex flex-row">
                <CardTitle>{habit.name}</CardTitle>
                <div
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this habit?"
                      )
                    ) {
                      handleDeleteHabit(habit.id);
                    }
                  }}
                  className="rounded-full hover:bg-red-500 cursor-pointer ml-4"
                  title="Delete Habit"
                >
                  <Trash2 className="w-4 h-4 text-red-500 hover:text-white" />
                </div>
              </CardContent>
              <CardContent className="">
                <p className="text-xs text-gray-400">
                  Target: {habit.streakDays || 30} days
                </p>
                <p className="text-xs text-gray-500">
                  Added:{" "}
                  {habit.createdAt?.toDate?.().toLocaleDateString() || "N/A"}
                </p>
              </CardContent>
            </div>
            <div>
              <div>
                <HabitWheel habit={habit} userId={userId} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
