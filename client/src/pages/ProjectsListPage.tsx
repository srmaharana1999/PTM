import { useNavigate } from "react-router-dom";
import { Plus, FolderKanban } from "lucide-react";
import { useGetProjects } from "@/hooks/useProjects";
import ProjectCard from "@/components/projects/ProjectCard";
import { LoadingSpinner, ErrorMessage, EmptyState } from "@/components/shared";

const ProjectsListPage = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useGetProjects();
  const projects = data?.data ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isLoading
              ? "Loading your projects…"
              : `${projects.length} project${projects.length !== 1 ? "s" : ""} found`}
          </p>
        </div>
        <button
          id="new-project-btn"
          onClick={() => navigate("/projects/new")}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 hover:opacity-90 transition-opacity self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </div>

      {/* States */}
      {isLoading && (
        <div className="flex justify-center py-16">
          <LoadingSpinner size="lg" label="Loading projects…" />
        </div>
      )}

      {isError && !isLoading && (
        <ErrorMessage
          error={error}
          onRetry={refetch}
          className="mx-auto max-w-sm"
        />
      )}

      {!isLoading && !isError && projects.length === 0 && (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create your first project to start managing tasks and collaborating with your team."
          action={{
            label: "Create Project",
            onClick: () => navigate("/projects/new"),
          }}
          className="py-16"
        />
      )}

      {/* Project grid */}
      {!isLoading && !isError && projects.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsListPage;
