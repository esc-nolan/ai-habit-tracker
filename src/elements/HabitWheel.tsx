import { updateHabitCompletion } from "@/lib/firebaseActions"; // Firestore update function
import { useState } from "react";
import { differenceInDays } from "date-fns";

export default function HabitWheel({
  habit,
  userId,
}: {
  habit: any;
  userId: string;
}) {
  const [localCompletion, setLocalCompletion] = useState<Record<string, boolean>>(habit.completionHistory || {});

  const totalDays = habit.streakDays || 30;
  const createdAt = habit.createdAt.toDate ? habit.createdAt.toDate() : new Date(habit.createdAt);
  const today = new Date();

  let todayIndex = differenceInDays(today, createdAt);
  if (todayIndex < 0) todayIndex = 0;
  if (todayIndex >= totalDays) todayIndex = totalDays - 1;

  const handleToggleToday = async (dayIndex: number) => {
    if (dayIndex !== todayIndex) return; // ✅ Prevent clicking others

    const key = dayIndex.toString();
    const updated = { ...localCompletion, [key]: !localCompletion[key] };
    setLocalCompletion(updated);
    await updateHabitCompletion(userId, habit.id, key, updated[key]);
  };

  return (
    <div className="relative w-15 h-15 mr-2">
      {Array.from({ length: totalDays }).map((_, index) => {
        const angle = (360 / totalDays) * index;
        const key = index.toString();
        const completed = localCompletion[key] || false;
        const isToday = index === todayIndex;

        return (
          <div
            key={index}
            onClick={() => handleToggleToday(index)} // Click only for today
            className={`absolute w-0.5 h-6 rounded-full transition
              ${completed ? "bg-green-500" : "bg-gray-500"}
              ${isToday ? "cursor-pointer hover:bg-gray-400" : "opacity-50 cursor-not-allowed"}`}
            style={{
              top: "", // ⬅️ Move away from center
              left: "",
              transform: `rotate(${angle}deg) translate(0, -15px)`,
              transformOrigin: "bottom center", // Rotating around bottom
            }}
            title={`Day ${index + 1} ${isToday ? "(Today)" : ""}`}
          />
        );
      })}
    </div>
  );
}
