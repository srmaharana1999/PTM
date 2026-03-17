import type { Payment } from "@/components/Dashboard/TaskList/Column";

// Cache the promise to make it compatible with React's use() hook
type Task = Omit<Payment, "edit" | "isCompleted">;
let cachedPromise: Promise<Task[]> | null = null;

export function getData(): Promise<Task[]> {
  if (!cachedPromise) {
    cachedPromise = fetchData();
  }
  return cachedPromise;
}

async function fetchData(): Promise<Task[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      status: "due",
      taskTitle: "Task One",
      start: new Date().toLocaleDateString(),
      due: new Date().toLocaleDateString(),
    },
    // ...
  ];
}

// Optional: Function to invalidate cache when you need fresh data
export function invalidateDataCache() {
  cachedPromise = null;
}
