import { db } from "./firebase";
import { collection, addDoc, doc, updateDoc, getDocs, getDoc, setDoc, serverTimestamp, deleteDoc } from "firebase/firestore";

// Add a new task
// export const addTask = async (userId: string, title: string) => {
//   await addDoc(collection(db, "users", userId, "tasks"), {
//     title,
//     createdAt: new Date(),
//     completionHistory: {}, // empty at start
//   });
// };

export const addUserTask = async (userId: string, title: string, desc:string) => {
  const taskData = {
    title,
    createdAt: new Date(),
    desc: desc,
  };
  const docRef = await addDoc(collection(db, "users", userId, "tasks"), taskData);
  return { id: docRef.id, ...taskData };
};


// Get all tasks of a user
export const getUserTasks = async (userId: string) => {
  const querySnapshot = await getDocs(collection(db, "users", userId, "tasks"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Get all habits of a user
export const getUserHabits = async (userId: string) => {
    const querySnapshot = await getDocs(collection(db, "users", userId, "habits"));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

// Update completion of a day
export const updateTaskCompletion = async (
  userId: string,
  taskId: string,
  date: string,
  isCompleted: boolean
) => {
  const taskRef = doc(db, "users", userId, "tasks", taskId);
  await updateDoc(taskRef, {
    [`completionHistory.${date}`]: isCompleted,
  });
};


// Add Habit
// export const handleAddHabit = async (
//     userId: string,
//     newHabit: string
// ) => {
//     if (!newHabit.trim()) return;
//     const habitData = { name: newHabit.trim(), createdAt: new Date() };
//     await addDoc(collection(db, "users", userId, "habits"), habitData);
//   };

  export const handleAddHabit = async (userId: string, name: string, streakDays: number) => {
    const habitRef = collection(db, "users", userId, "habits");
    await addDoc(habitRef, {
      name,
      streakDays,
      createdAt: serverTimestamp(),
      completionHistory: {} // initialize empty history
    });
  };
  
  export const updateHabitCompletion = async (
    userId: string,
    habitId: string,
    dayKey: string, // ✅ Keep this string
    completed: boolean
  ) => {
    const habitRef = doc(db, "users", userId, "habits", habitId);
    await updateDoc(habitRef, {
      [`completionHistory.${dayKey}`]: completed, // Store/update with string key
    });
  };

export const deleteHabit = async (userId: string, habitId: string) => {
  try {
    await deleteDoc(doc(db, "users", userId, "habits", habitId));
    console.log("Habit deleted successfully");
  } catch (error) {
    console.error("Error deleting habit: ", error);
  }
};

  


// ✅ Fetch todos for a user for a specific date
export const getUserTodosForDate = async (userId: string, date: string) => {
  const docRef = doc(db, 'users', userId, 'todos', date); // 'todos' instead of 'tasks'
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data().todos : [];
};

// ✅ Save todos for a user for a specific date
export const saveUserTodosForDate = async (userId: string, date: string, todos: any[]) => {
  const docRef = doc(db, 'users', userId, 'todos', date); // 'todos' instead of 'tasks'
  await setDoc(docRef, { todos });
};
