'use client';

import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format, addDays, differenceInDays } from "date-fns";
import { useUser } from "@/lib/auth"; // Your existing auth hook
import { updateTaskCompletion } from "@/lib/firebaseActions";
import { useEffect, useRef, useState } from "react";

interface TaskDetailModalProps {
  task: { id: string; title: string; completionHistory: Record<string, boolean>; createdAt: any; desc: string }; // Can be string or Timestamp
}

export default function TaskDetailModal({ task }: TaskDetailModalProps) {
  const { user } = useUser();
  const userId = user?.uid;
  const today = new Date();

  // ✅ Safe parsing of createdAt
  const createdAtDate = task.createdAt
    ? (task.createdAt.toDate ? task.createdAt.toDate() : new Date(task.createdAt))
    : today;

  // ✅ Check if date is valid, fallback to today if invalid
  if (isNaN(createdAtDate.getTime())) {
    console.error("Invalid createdAt date:", task.createdAt);
    return <div>Error: Invalid createdAt date.</div>; // Graceful error UI
  }

  // ✅ Local state to reflect updates instantly
  const [localHistory, setLocalHistory] = useState<Record<string, boolean>>(task.completionHistory || {});

  // ✅ Calculate total days from createdAt to today
  const totalDays = differenceInDays(today, createdAtDate) + 1; // Include today

  // ✅ Generate array of dates from createdAt to today
  const daysArray = Array.from({ length: totalDays }, (_, i) => addDays(createdAtDate, i));

  const handleToggle = async (dateKey: string, currentState: boolean) => {
    if (!userId) return;

    // ✅ Optimistically update UI
    setLocalHistory((prev) => ({
      ...prev,
      [dateKey]: !currentState,
    }));

    // ✅ Update Firestore
    await updateTaskCompletion(userId, task.id, dateKey, !currentState);
  };

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [daysArray]);



  return (
    <DialogContent className="max-w-3xl h-96">
      <DialogHeader>
        <DialogTitle className="text-center text-xl">{task.title}</DialogTitle>
      </DialogHeader>

      <div className="text-center text-sm text-zinc-400">
        <p>{task.desc}</p>
      </div>

      {/* Scrollable Calendar */}
      <div className="overflow-x-auto mt-6">
        <div className="min-w-max">
          {/* Weekday Labels dynamically aligned for first 7 days */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {Array.from({ length: 7 }, (_, i) => {
              const date = addDays(createdAtDate, i);
              return (
                <span
                  key={format(date, "yyyy-MM-dd")}
                  className="text-center text-xs text-zinc-400"
                >
                  {format(date, "EEE")}
                </span>
              );
            })}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {daysArray.map((date, index) => {
              const dateKey = format(date, "yyyy-MM-dd");
              const done = localHistory[dateKey] || false;
              const monthLabel = format(date, "MMM");

              // ✅ Show month label if it's the first of the month OR first entry
              const showMonth = date.getDate() === 1 || (index > 0 && date.getMonth() !== daysArray[index - 1].getMonth());
              const showYear = date.getDate() === 1 && date.getMonth() === 0 || (index > 0 && date.getFullYear() !== daysArray[index - 1].getFullYear());


              return (
                <div key={dateKey} className="flex flex-col items-center gap-1">
                  {showYear && <span className="text-xs text-white mb-1">{format(date, "yyyy")}</span>}

                  {showMonth && (
                    <span className="text-xs text-white mb-1">{monthLabel}</span>
                  )}

                  <div
                    className={`w-8 h-8 rounded-md border cursor-pointer transition ${
                      done ? "bg-green-500 border-green-500" : "border-zinc-600 hover:bg-zinc-700"
                    }`}
                    title={format(date, "PPP")}
                    onClick={() => handleToggle(dateKey, done)}
                  />
                  <span className="text-[10px] text-zinc-400">{format(date, "d")}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </DialogContent>
  );
}
