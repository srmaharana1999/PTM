import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Eye, Trash2, Calendar } from "lucide-react";
import { useAppSelector } from "@/app/hooks";
import { useDeleteProject } from "@/hooks/useProjects";
import { ProjectStatusBadge } from "@/components/shared/Badge";
import { ConfirmDialog } from "@/components/shared";
import { formatDate, getInitials } from "@/lib/utils";
import type { IProject } from "@/lib/types";
import toast from "react-hot-toast";

interface ProjectCardProps {
  project: IProject;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isOwner = user?._id === project.owner._id;
  const deleteProject = useDeleteProject();

  const handleDelete = () => {
    deleteProject.mutate(project._id, {
      onSuccess: () => {
        toast.success(`"${project.title}" deleted.`);
        setConfirmOpen(false);
      },
      onError: (err: unknown) => {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message ?? "Delete failed.";
        toast.error(msg);
        setConfirmOpen(false);
      },
    });
  };

  return (
    <>
      <div className="group relative flex flex-col rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 hover:border-violet-500/30 hover:bg-white/8 transition-all duration-200">
        {/* Top row: status badge + actions */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <ProjectStatusBadge status={project.status} />
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {isOwner && (
              <>
                <button
                  onClick={() => navigate(`/projects/${project._id}/settings`)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
                  aria-label="Project settings"
                  title="Settings"
                >
                  <Settings className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setConfirmOpen(true)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  aria-label="Delete project"
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Title */}
        <h2 className="font-semibold text-base leading-snug line-clamp-1 mb-1">
          {project.title}
        </h2>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 flex-1 mb-4">
          {project.description}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          {/* Owner */}
          <div className="flex items-center gap-1.5">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-[9px] font-bold text-white shrink-0">
              {getInitials(project.owner.name)}
            </div>
            <span className="truncate max-w-[90px]">{project.owner.name}</span>
          </div>
          {/* Members count */}
          {/* <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{project.members.length}</span>
          </div> */}
          {/* Created at */}
          <div className="flex items-center gap-1 ml-auto">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(project.createdAt)}</span>
          </div>
        </div>

        {/* View button */}
        <button
          onClick={() => navigate(`/projects/${project._id}`)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 py-2 text-sm font-medium text-violet-300 hover:bg-violet-500/20 hover:text-violet-200 transition-colors"
        >
          <Eye className="h-3.5 w-3.5" />
          View Project
        </button>
      </div>

      {/* Confirm delete dialog */}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Project"
        description={`Are you sure you want to delete "${project.title}"? This will also delete all tasks inside it. This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={deleteProject.isPending}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
};

export default ProjectCard;
