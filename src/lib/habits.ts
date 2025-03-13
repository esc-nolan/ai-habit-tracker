import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const addHabit = async (userId: string, title: string, frequency: string) => {
  await addDoc(collection(db, "habits"), {
    userId,
    title,
    frequency,
    createdAt: serverTimestamp(),
    completedDates: [],
  });
};
