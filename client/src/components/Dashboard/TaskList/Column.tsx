import type { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string;
  status: "pending" | "due" | "completed";
  taskTitle: string;
  start: string;
  due: string;
  isCompleted: string;
  edit: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "taskTitle",
    header: "Task Title",
  },
  {
    accessorKey: "start",
    header: "Start",
  },
  {
    accessorKey: "due",
    header: "Due",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "isCompleted",
    header: "Is Completed ?",
  },
  {
    accessorKey: "edit",
    header: "Edit",
  },
];
