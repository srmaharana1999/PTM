import { useNavigate } from "react-router-dom";
import {
  FolderKanban,
  CheckSquare,
  Clock,
  AlertTriangle,
  ArrowRight,
  Plus,
} from "lucide-react";
import { useGetProjects } from "@/hooks/useProjects";
import { useAppSelector } from "@/app/hooks";
import { LoadingSpinner, ProjectStatusBadge } from "@/components/shared";
import StatCard from "@/components/Dashboard/StatCard";
import ProjectRow from "@/components/Dashboard/ProjectRow";
import QuickActionCard from "@/components/Dashboard/QuickActionCard";

// ── Per-project task summary (calls useGetTasks per project) ─────────────────

// ── Main Dashboard component ──────────────────────────────────────────────────

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);
  const { data: projectsData, isLoading: projectsLoading } = useGetProjects();

  const projects = projectsData?.data ?? [];

  // We need task stats across all projects. Use the first project's tasks
  // for a demo stat — full aggregation would require multiple queries.
  // We'll aggregate by fetching each project's tasks inline in ProjectRow
  // and derive global numbers separately.

  // Count tasks from cached queries (already in queryClient cache from ProjectRows)
  // For the stat cards we use project-level counts as approximations
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === "active").length;

  // Recent projects: last 4 by createdAt
  const recentProjects = [...projects]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 4);

  // const recentProjects = [];
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8">
      {/* ── Greeting ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">
            {greeting()}, {user?.name?.split(" ")[0] ?? "there"} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Here's what's happening across your projects.
          </p>
        </div>
        <button
          onClick={() => navigate("/projects/new")}
          className="flex items-center gap-2 self-start cursor-pointer sm:self-auto rounded-lg bg-linear-to-r from-violet-500 to-fuchsia-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </div>

      {/* ── Stat cards ───────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Projects"
          value={totalProjects}
          icon={FolderKanban}
          gradient="from-violet-500/15 to-fuchsia-500/5"
          border="border-violet-500/20"
          isLoading={projectsLoading}
        />
        <StatCard
          label="Active Projects"
          value={activeProjects}
          icon={Clock}
          gradient="from-amber-500/15 to-orange-500/5"
          border="border-amber-500/20"
          isLoading={projectsLoading}
        />
        <StatCard
          label="Completed"
          value={totalProjects - activeProjects}
          icon={CheckSquare}
          gradient="from-emerald-500/15 to-teal-500/5"
          border="border-emerald-500/20"
          isLoading={projectsLoading}
        />
        <StatCard
          label="Needs Attention"
          value={activeProjects > 0 ? activeProjects : 0}
          icon={AlertTriangle}
          gradient="from-rose-500/15 to-pink-500/5"
          border="border-rose-500/20"
          isLoading={projectsLoading}
        />
      </div>

      {/* ── Recent Projects ───────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">Recent Projects</h2>
          <button
            onClick={() => navigate("/projects")}
            className="flex items-center gap-1 text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors"
          >
            View all
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {projectsLoading ? (
          <div className="flex justify-center py-10">
            <LoadingSpinner size="md" label="Loading projects…" />
          </div>
        ) : recentProjects.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
            <FolderKanban className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-medium">No projects yet</p>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              Create your first project to see it here.
            </p>
            <button
              onClick={() => navigate("/projects/new")}
              className="rounded-xl bg-linear-to-r from-violet-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Create Project
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {recentProjects.map((project) => (
              <div key={project._id} className="flex items-center gap-2">
                <div className="flex-1 min-w-0">
                  <ProjectRow
                    project={project}
                    onClick={() => navigate(`/projects/${project._id}`)}
                  />
                </div>
                <ProjectStatusBadge status={project.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Quick actions ─────────────────────────────────── */}
      <div>
        <h2 className="text-base font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <QuickActionCard
            icon={Plus}
            redirectLink="/projects/new"
            title="New Project"
            shortDescription="Start a fresh project"
          />
          <QuickActionCard
            icon={FolderKanban}
            redirectLink="/projects"
            title="Browse Projects"
            shortDescription={`View all ${totalProjects} project${totalProjects !== 1 ? "s" : ""}`}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
