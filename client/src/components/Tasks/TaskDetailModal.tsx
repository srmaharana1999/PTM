import { useEffect } from "react";
import { X, Save, Eye } from "lucide-react";
import { type TaskValues } from "@/lib/schema/taskSchema.ts";
import { ProjectRole, type ITask } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { PriorityBadge, TaskStatusBadge } from "@/components/shared";
import EditTaskModal from "./EditTaskModal";

interface TaskDetailModalProps {
  open: boolean;
  task: ITask | null;
  projectId: string;
  userRole: string;
  mode: "view" | "edit";
  onClose: () => void;
  onSwitchToEdit: () => void;
}

const TaskDetailModal = ({
  open,
  task,
  projectId,
  userRole,
  mode,
  onClose,
  onSwitchToEdit,
}: TaskDetailModalProps) => {
  const canEdit =
    userRole === ProjectRole.OWNER || userRole === ProjectRole.ADMIN;

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open || !task) return null;

  const editInitial: TaskValues = {
    title: task.title,
    description: task.description,
    priority: task.priority,
    status: task.status,
    dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
    assigneeId: task.assigneeId?._id ?? "",
    projectId,
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-white/15 bg-background/95 backdrop-blur-2xl shadow-2xl animate-in zoom-in-95 fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-2 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-2">
            {mode === "view" ? (
              <Eye className="h-4 w-4 text-violet-400" />
            ) : (
              <Save className="h-4 w-4 text-violet-400" />
            )}
            <h2 className="text-base font-semibold">
              {mode === "view" ? "Task Detail" : "Edit Task"}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {canEdit && mode === "view" && (
              <button
                onClick={onSwitchToEdit}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium hover:bg-white/10 transition-colors"
              >
                Edit
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ── VIEW MODE ── */}
        {mode === "view" && (
          <div className="p-4 max-h-[70vh] overflow-y-auto">
            <h3 className="text-lg font-semibold">{task.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {task.description}
            </p>
            <div className="rounded-xl border mt-4 border-white/10 bg-white/5 p-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                    Priority
                  </p>
                  <PriorityBadge priority={task.priority} />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                    Status
                  </p>
                  <TaskStatusBadge status={task.status} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                    Assignee
                  </p>
                  <p className="text-sm font-medium">
                    {task.assigneeId?.name ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                    Due Date
                  </p>
                  <p className="text-sm font-medium">
                    {task.dueDate ? formatDate(task.dueDate) : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                    Created by
                  </p>
                  <p className="text-sm font-medium">
                    {task.createdBy?.name ?? "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── EDIT MODE ── */}
        {mode === "edit" && (
          <EditTaskModal
            open={open}
            projectId={projectId}
            onClose={onClose}
            initialValues={editInitial}
            task={task}
          />
        )}
      </div>
    </div>
  );
};

export default TaskDetailModal;
