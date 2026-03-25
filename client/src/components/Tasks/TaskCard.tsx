import {
  Calendar,
  MoreVertical,
  ExternalLink,
  Clock,
  User,
} from "lucide-react";
import type { ITask } from "@/lib/types";
import { TaskPriority, TaskStatus, ProjectRole } from "@/lib/types";
import {
  cn,
  extractErrorMessage,
  formatDate,
  getInitials,
  isOverdue,
} from "@/lib/utils";
import { useAppSelector } from "@/app/hooks";
import { useUpdateTask } from "@/hooks/useTasks";
import toast from "react-hot-toast";

interface TaskCardProps {
  task: ITask;
  userRole: string;
  onEdit: (task: ITask) => void;
  onView: (task: ITask) => void;
}

const priorityStyles: Record<
  TaskPriority,
  { dot: string; bg: string; text: string }
> = {
  [TaskPriority.LOW]: {
    dot: "bg-emerald-500",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
  },
  [TaskPriority.MEDIUM]: {
    dot: "bg-amber-500",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
  },
  [TaskPriority.HIGH]: {
    dot: "bg-rose-500",
    bg: "bg-rose-500/10",
    text: "text-rose-400",
  },
};

const TaskCard = ({ task, userRole, onEdit, onView }: TaskCardProps) => {
  const overdue = isOverdue(task.dueDate) && task.status !== TaskStatus.DONE;
  const canEdit =
    userRole === ProjectRole.OWNER || userRole === ProjectRole.ADMIN;
  const { user } = useAppSelector((s) => s.auth);
  const isAssignee = task?.assigneeId?._id === user?._id;
  const updateTask = useUpdateTask();

  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const newStatus = e.target.value;

    updateTask.mutate(
      {
        id: task._id,
        data: {
          status: newStatus as TaskStatus,
          projectId: task.projectId._id,
        },
      },
      {
        onSuccess: () => {
          toast.success("Status updated");
        },
        onError: (err) => {
          toast.error(extractErrorMessage(err));
        },
      },
    );
  };

  const style = priorityStyles[task.priority];

  return (
    <div
      onClick={() => onView(task)}
      className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/3 p-4 backdrop-blur-xl transition-all duration-500 hover:border-violet-500/40 hover:bg-white/6 cursor-pointer"
    >
      {/* Selection Glow Effect */}
      <div className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-linear-to-br from-violet-500/5 via-transparent to-fuchsia-500/5 rounded-2xl pointer-events-none" />

      {/* Top Section: Category & Actions */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-white/5",
              style.bg,
              style.text,
            )}
          >
            <div
              className={cn(
                "h-1.5 w-1.5 rounded-full shadow-[0_0_8px_currentColor]",
                style.dot,
              )}
            />
            {task.priority}
          </div>
          {overdue && (
            <div className="flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-500 border border-rose-500/20 animate-pulse">
              <Clock className="h-3 w-3" />
              Overdue
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          {isAssignee && (
            <div
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              className="relative"
            >
              <select
                value={task.status}
                onChange={handleStatusChange}
                className="appearance-none rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-tight text-white/70 outline-none transition-all hover:bg-white/10 hover:text-white focus:ring-1 focus:ring-violet-500/50"
              >
                <option value={TaskStatus.TODO} className="bg-[#1a1a1a]">
                  ToDo
                </option>
                <option value={TaskStatus.IN_PROGRESS} className="bg-[#1a1a1a]">
                  In Progress
                </option>
                <option value={TaskStatus.DONE} className="bg-[#1a1a1a]">
                  Done
                </option>
              </select>
            </div>
          )}

          {canEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              className="rounded-lg p-1.5 text-white/30 hover:bg-white/10 hover:text-white transition-all duration-300"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="space-y-1.5 relative z-10">
        <h3 className="text-base font-medium text-white/90 group-hover:text-white transition-colors duration-300 leading-tight">
          {task.title}
        </h3>
        <p className="text-[13px] leading-relaxed text-white/40 line-clamp-1 font-light">
          {task.description || "No description provided."}
        </p>
      </div>

      {/* Bottom Section: Footer Info */}
      <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-1 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="relative group/avatar">
            {task.assigneeId ? (
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br from-violet-500 to-fuchsia-500 text-[10px] font-bold text-white shadow-lg ring-1 ring-white/20 transition-transform group-hover/avatar:scale-110">
                {getInitials(task.assigneeId.name)}
              </div>
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-dashed border-white/20 bg-white/5 text-white/20">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-white/70 font-medium truncate max-w-24">
              {task.assigneeId?.name ?? "Unassigned"}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div
            className={cn(
              "flex items-center gap-1.5 text-xs font-medium",
              overdue ? "text-rose-400" : "text-white/60",
            )}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        </div>
      </div>

      {/* Subtle Bottom Accent */}
      <div className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-linear-to-r from-violet-400 to-fuchsia-400 transition-all duration-500 group-hover:w-full opacity-50" />

      {/* View Detail Trigger (Invisible but accessible) */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
        <ExternalLink className="h-4 w-4 text-violet-400/50 hover:text-violet-400" />
      </div>
    </div>
  );
};

export default TaskCard;
