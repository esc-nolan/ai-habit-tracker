// "use client";

// import { getDateRange } from "@/lib/utils";
// import { updateTaskCompletion } from "@/lib/firebaseActions";
// import { useState } from "react";

// interface DailyTaskCardProps {
//   taskId: string;
//   title: string;
//   createdAt: Date;
//   completionHistory: { [date: string]: boolean };
//   userId: string;
// }

// export default function DailyTaskCard({
//   taskId,
//   title,
//   createdAt,
//   completionHistory,
//   userId
// }: DailyTaskCardProps) {
//   const [history, setHistory] = useState(completionHistory);
//   const dates = getDateRange(createdAt, new Date());

//   const toggleCompletion = async (date: string) => {
//     const newStatus = !history[date];
//     const updatedHistory = { ...history, [date]: newStatus };
//     setHistory(updatedHistory);
//     await updateTaskCompletion(userId, taskId, date, newStatus);
//   };

//   return (
//     <div className="bg-zinc-900 p-4 rounded-xl shadow-lg mb-4 w-1/2 flex justify-between gap-2">
//       <h3 className="text-sm font-light text-white mb-2">{title}</h3>
//       <div className="grid grid-cols-7 gap-1 mt-2">
//         {dates.map((dateObj, idx) => {
//           const dateStr = dateObj.toISOString().split("T")[0]; // YYYY-MM-DD
//           const done = history[dateStr];
//           return (
//             <div
//               key={idx}
//               onClick={() => toggleCompletion(dateStr)}
//               className={`w-3 h-3 rounded cursor-pointer border 
//                 ${done ? "bg-green-500 border-green-700" : "bg-zinc-800 border-zinc-700"}
//               `}
//               title={dateStr}
//             />
//           );
//         })}
//       </div>
//     </div>
//   );
// }
