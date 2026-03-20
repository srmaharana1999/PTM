import { useState } from "react";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus, Crown, Shield, User2 } from "lucide-react";
import {
  useGetProjectMembers,
  useUpdateMemberRole,
  useDeleteMembers,
} from "@/hooks/useMember";
import { useGetProjectById } from "@/hooks/useProjects";
import { useAppSelector } from "@/app/hooks";
import {
  LoadingSpinner,
  ErrorMessage,
  ConfirmDialog,
} from "@/components/shared";
import AddMemberModal from "@/components/members/AddMemberModal";
import { ProjectRole, type IProjectMember } from "@/lib/types";
import { extractErrorMessage, getInitials } from "@/lib/utils";
import toast from "react-hot-toast";

const roleIcons: Record<ProjectRole, React.ReactNode> = {
  owner: <Crown className="h-3 w-3 text-amber-400" />,
  admin: <Shield className="h-3 w-3 text-violet-400" />,
  member: <User2 className="h-3 w-3 text-muted-foreground" />,
};

const ProjectMembersPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);

  const projectQuery = useGetProjectById(id!);
  const membersQuery = useGetProjectMembers(id!);
  const updateRole = useUpdateMemberRole(id!);
  const deleteMembers = useDeleteMembers(id!);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [removingMember, setRemovingMember] = useState<IProjectMember | null>(
    null,
  );

  const project = projectQuery.data?.data;
  const members = membersQuery.data?.data ?? [];

  // Determine current user's role
  const myMembership = members.find((m) => m.user._id === user?._id);
  const myRole = myMembership?.role;
  const isOwner = myRole === ProjectRole.OWNER;

  // Only owner can access this page
  useEffect(() => {
    if (!membersQuery.isLoading && myRole && myRole !== ProjectRole.OWNER) {
      navigate(`/projects/${id}`, { replace: true });
    }
  }, [myRole, membersQuery.isLoading, id, navigate]);

  const handleRoleChange = (member: IProjectMember, newRole: ProjectRole) => {
    updateRole.mutate(
      { memberId: member._id, role: newRole },
      {
        onSuccess: () =>
          toast.success(`${member.user.name}'s role updated to ${newRole}.`),
        onError: (err) => toast.error(extractErrorMessage(err)),
      },
    );
  };

  const handleRemoveConfirm = () => {
    if (!removingMember) return;
    deleteMembers.mutate([removingMember.user._id], {
      onSuccess: () => {
        toast.success(`${removingMember.user.name} removed from project.`);
        setRemovingMember(null);
      },
      onError: (err) => {
        toast.error(extractErrorMessage(err));
        setRemovingMember(null);
      },
    });
  };

  if (projectQuery.isLoading || membersQuery.isLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" label="Loading members…" />
      </div>
    );
  }

  if (projectQuery.isError || membersQuery.isError) {
    return (
      <ErrorMessage
        error={projectQuery.error ?? membersQuery.error}
        onRetry={() => {
          projectQuery.refetch();
          membersQuery.refetch();
        }}
        className="max-w-sm mx-auto mt-10"
      />
    );
  }

  return (
    <>
      <div className="max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/projects/${id}`)}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors shrink-0"
            aria-label="Back to project"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold">Members</h1>
            <p className="text-sm text-muted-foreground truncate">
              {project?.title} · {members.length} member
              {members.length !== 1 ? "s" : ""}
            </p>
          </div>
          {isOwner && (
            <button
              id="add-member-btn"
              onClick={() => setAddModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-linear-to-r from-violet-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:opacity-90 transition-opacity shrink-0"
            >
              <UserPlus className="h-4 w-4" />
              Add Member
            </button>
          )}
        </div>

        {/* Members table card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 px-4 py-3 border-b border-white/10 bg-white/3">
            <div className="w-8" />
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
              Member
            </p>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60 w-28 text-center">
              Role
            </p>
            <div className="w-20" />
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/5">
            {members.map((member) => {
              const isMe = member.user._id === user?._id;
              const isThisOwner = member.role === ProjectRole.OWNER;

              return (
                <div
                  key={member._id}
                  className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 px-4 py-3.5 hover:bg-white/3 transition-colors"
                >
                  {/* Avatar */}
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-fuchsia-500 text-xs font-bold text-white shrink-0">
                    {getInitials(member.user.name)}
                  </div>

                  {/* Name + email + role icon inline */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium truncate">
                        {member.user.name}
                      </p>
                      {roleIcons[member.role]}
                      {isMe && (
                        <span className="text-[10px] font-semibold text-violet-400 border border-violet-400/30 rounded-full px-1.5">
                          you
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {member.user.email}
                    </p>
                  </div>

                  {/* Role dropdown */}
                  <div className="w-28">
                    {isOwner && !isThisOwner ? (
                      <select
                        value={member.role}
                        onChange={(e) =>
                          handleRoleChange(
                            member,
                            e.target.value as ProjectRole,
                          )
                        }
                        disabled={updateRole.isPending}
                        className="w-full rounded-md border border-white/15 bg-background py-1.5 text-xs outline-none focus:border-violet-500/60 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value={ProjectRole.MEMBER}>Member</option>
                        <option value={ProjectRole.ADMIN}>Admin</option>
                      </select>
                    ) : (
                      <span className="block text-center text-xs font-medium capitalize text-muted-foreground">
                        {member.role}
                      </span>
                    )}
                  </div>

                  {/* Remove button */}
                  <div className="w-20 flex justify-end">
                    {isOwner && !isThisOwner && (
                      <button
                        onClick={() => setRemovingMember(member)}
                        className="rounded-lg border border-destructive/30 bg-destructive/10 px-2.5 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20 transition-colors"
                        aria-label={`Remove ${member.user.name}`}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {addModalOpen && (
        <AddMemberModal
          open={addModalOpen}
          projectId={id!}
          onClose={() => setAddModalOpen(false)}
        />
      )}

      {/* Remove Member Confirm Dialog */}
      <ConfirmDialog
        open={!!removingMember}
        title="Remove Member"
        description={`Remove "${removingMember?.user.name}" from this project? They will lose access to all tasks.`}
        confirmLabel="Remove"
        isLoading={deleteMembers.isPending}
        onConfirm={handleRemoveConfirm}
        onCancel={() => setRemovingMember(null)}
      />
    </>
  );
};

export default ProjectMembersPage;
