import { useGetTasks } from "@/hooks/useTasks";
import type { IProject } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface ProjectRowProps {
  project: IProject;
  onClick: () => void;
}

const ProjectRow = ({ project, onClick }: ProjectRowProps) => {
  const { data, isLoading } = useGetTasks(project._id);
  const tasks = data?.data ?? [];
  const done = tasks.filter((t) => t.status === "done").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 hover:bg-white/8 hover:border-violet-500/20 transition-all group text-left"
    >
      {/* Status dot */}
      <div
        className={`h-2.5 w-2.5 rounded-full shrink-0 ${
          project.status === "active" ? "bg-emerald-400" : "bg-blue-400"
        }`}
      />

      {/* Title + badge */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{project.title}</p>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {formatDate(project.createdAt)}
        </p>
      </div>

      {/* Task mini stats */}
      {isLoading ? (
        <div className="h-4 w-16 rounded bg-white/10 animate-pulse" />
      ) : (
        <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
          <span className="text-amber-400">{inProgress} in progress</span>
          <span>·</span>
          <span className="text-emerald-400">{done} done</span>
        </div>
      )}

      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-violet-400 transition-colors shrink-0" />
    </button>
  );
};

export default ProjectRow;
