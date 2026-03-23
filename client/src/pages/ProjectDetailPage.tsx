import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Settings, Users, Plus, ArrowLeft } from "lucide-react";
import { useGetProjectById } from "@/hooks/useProjects";
import { useGetTasks } from "@/hooks/useTasks";
import { useGetProjectMembers } from "@/hooks/useMember";
import { useAppSelector } from "@/app/hooks";
import {
  LoadingSpinner,
  ErrorMessage,
  ProjectStatusBadge,
} from "@/components/shared";

import { ProjectRole, type ITask } from "@/lib/types";
import { getInitials } from "@/lib/utils";
import KanbanBoard from "@/components/Tasks/KanbanBoard";
import CreateTaskModal from "@/components/Tasks/CreateTaskModal";
import TaskDetailModal from "@/components/Tasks/TaskDetailModal";

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);

  const projectQuery = useGetProjectById(id!);
  const tasksQuery = useGetTasks(id!);
  const membersQuery = useGetProjectMembers(id!);

  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [viewTask, setViewTask] = useState<ITask | null>(null);
  const [taskModalMode, setTaskModalMode] = useState<"view" | "edit">("view");

  const project = projectQuery.data?.data;
  const tasks = tasksQuery.data?.data ?? [];
  const members = membersQuery.data?.data ?? [];

  // Determine logged-in user's role in this project
  const myMembership = members.find((m) => m.user._id === user?._id);
  const myRole = myMembership?.role ?? ProjectRole.MEMBER;
  const canManage =
    myRole === ProjectRole.OWNER || myRole === ProjectRole.ADMIN;

  // Loading / error states
  if (projectQuery.isLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" label="Loading project…" />
      </div>
    );
  }
  if (projectQuery.isError || !project) {
    return (
      <ErrorMessage
        error={projectQuery.error}
        onRetry={projectQuery.refetch}
        className="max-w-sm mx-auto mt-10"
      />
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* ── Header ──────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <button
              onClick={() => navigate("/projects")}
              className="flex items-center justify-center h-8 w-8 mt-1 rounded-xl border border-white/15 bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors shrink-0"
              aria-label="Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold">{project.title}</h1>
                <ProjectStatusBadge status={project.status} />
              </div>
              <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                {project.description}
              </p>
            </div>
          </div>

          {/* Actions (owner only) */}
          {canManage && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => navigate(`/projects/${id}/members`)}
                className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium hover:bg-white/10 transition-colors"
              >
                <Users className="h-4 w-4" />
                Members
              </button>
              {myRole === ProjectRole.OWNER && (
                <button
                  onClick={() => navigate(`/projects/${id}/settings`)}
                  className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
              )}
              <button
                id="add-task-btn"
                onClick={() => setCreateTaskOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-linear-to-r from-violet-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:opacity-90 transition-opacity"
              >
                <Plus className="h-4 w-4" />
                Add Task
              </button>
            </div>
          )}
        </div>

        {/* ── Members strip ────────────────────────────────────── */}
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <div className="flex -space-x-2">
            {members.slice(0, 5).map((m) => (
              <div
                key={m._id}
                title={`${m.user.name} (${m.role})`}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-fuchsia-500 text-[9px] font-bold text-white ring-2 ring-background"
              >
                {getInitials(m.user.name)}
              </div>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {members.length} member{members.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={() => navigate(`/projects/${id}/members`)}
            className="ml-auto text-xs text-violet-400 hover:text-violet-300 transition-colors"
          >
            Manage →
          </button>
        </div>

        {/* ── Kanban Board ─────────────────────────────────────── */}
        {tasksQuery.isLoading ? (
          <div className="flex justify-center py-10">
            <LoadingSpinner size="md" label="Loading tasks…" />
          </div>
        ) : tasksQuery.isError ? (
          <ErrorMessage error={tasksQuery.error} onRetry={tasksQuery.refetch} />
        ) : (
          <KanbanBoard
            tasks={tasks}
            userRole={myRole}
            onEditTask={(task) => {
              setViewTask(task);
              setTaskModalMode("edit");
            }}
            onViewTask={(task) => {
              setViewTask(task);
              setTaskModalMode("view");
            }}
          />
        )}
      </div>

      {/* ── Modals ─────────────────────────────────────────────── */}
      <CreateTaskModal
        open={createTaskOpen}
        projectId={id!}
        onClose={() => setCreateTaskOpen(false)}
      />

      <TaskDetailModal
        open={!!viewTask}
        task={viewTask}
        projectId={id!}
        userRole={myRole}
        mode={taskModalMode}
        onClose={() => setViewTask(null)}
        onSwitchToEdit={() => setTaskModalMode("edit")}
      />
    </>
  );
};

export default ProjectDetailPage;
