import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {  Form, Formik } from "formik";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { useGetProjectById, useUpdateProject, useDeleteProject } from "@/hooks/useProjects";
import { useGetProjectMembers } from "@/hooks/useMember";
import { useAppSelector } from "@/app/hooks";
import { projectSchema } from "@/lib/schema/projectSchema";
import { ProjectRole, ProjectStatus, type IUpdateProjectValue } from "@/lib/types";
import { extractErrorMessage } from "@/lib/utils";
import { LoadingSpinner, ErrorMessage, ConfirmDialog } from "@/components/shared";
import toast from "react-hot-toast";
import InputField from "@/components/Fields/InputField";
import TextAreaField from "@/components/Fields/TextAreaField";
import SelectField from "@/components/Fields/SelectField";
import SelectWithInput from "@/components/Fields/SelectWithInput";
import { useUsers } from "@/hooks/useAuth";

const statusOptions = [
  { value: ProjectStatus.ACTIVE, label: ProjectStatus.ACTIVE },
  { value: ProjectStatus.COMPLETED, label: ProjectStatus.COMPLETED },
];

const ProjectSettingsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);
  const { data: allUsers } = useUsers();

  const projectQuery = useGetProjectById(id!);
  const membersQuery = useGetProjectMembers(id!);
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const [confirmDelete, setConfirmDelete] = useState(false);

  const project = projectQuery.data?.data;
  const members = membersQuery.data?.data ?? [];

  const projectMembers = members.map((member) =>member?.user._id);

  console.log(project)

  // Only project OWNER can access this page
  useEffect(() => {
    if (!project || !user) return;
    if (project.owner._id !== user._id) {
      navigate(`/projects/${id}`, { replace: true });
    }
  }, [project, user, id, navigate]);

  // Block access for non-owners while members load
  const myMembership = members.find((m) => m.user._id === user?._id);
  const myRole = myMembership?.role;
  if (myRole && myRole !== ProjectRole.OWNER) {
    navigate(`/projects/${id}`, { replace: true });
    return null;
  }

  if (projectQuery.isLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" label="Loading project…" />
      </div>
    );
  }
  if (projectQuery.isError || !project) {
    return <ErrorMessage error={projectQuery.error} onRetry={projectQuery.refetch} className="max-w-sm mx-auto mt-10" />;
  }

  const initialValues: IUpdateProjectValue = {
    title: project.title,
    description: project.description,
    status: project.status,
    members: projectMembers,
  };

  const handleUpdate = (values: IUpdateProjectValue) => {
    updateProject.mutate(
      { id: id!, data: values },
      {
        onSuccess: () => toast.success("Project updated!"),
        onError: (err) => toast.error(extractErrorMessage(err)),
      }
    );
  };

  const handleDelete = () => {
    deleteProject.mutate(id!, {
      onSuccess: () => {
        toast.success(`"${project.title}" deleted.`);
        navigate("/projects", { replace: true });
      },
      onError: (err) => {
        toast.error(extractErrorMessage(err));
        setConfirmDelete(false);
      },
    });
  };

  return (
    <>
      <div className="max-w-xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/projects/${id}`)}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
            aria-label="Back to project"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Project Settings</h1>
            <p className="text-sm text-muted-foreground">{project.title}</p>
          </div>
        </div>

        {/* Edit form card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 space-y-1">
          <h2 className="text-sm font-semibold mb-4">General</h2>
          <Formik
            initialValues={initialValues}
            validationSchema={projectSchema}
            onSubmit={handleUpdate}
            enableReinitialize
          >
            {() => (
              <Form className="space-y-5">
                {/* Title */}
                <InputField label="Title" type="text" name="title" placeholder="Project Title" id="settings-title" isRequired />
                <TextAreaField label="Description" name="description" placeholder="Project Description" id="settings-desc" rows={4} isRequired />
                <SelectField label="Status" name="status" placeholder="Project Status" id="settings-status" options={statusOptions} isRequired />
                <SelectWithInput label="Members" name="members" placeholder="Project Members" id="settings-members" options={allUsers?.data} isRequired />
                
                
                <button id="save-settings-btn" type="submit" disabled={updateProject.isPending}
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-linear-to-r from-violet-500 to-fuchsia-500 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60">
                  {updateProject.isPending
                    ? <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    : <><Save className="h-4 w-4" />Save Changes</>
                  }
                </button>
              </Form>
            )}
          </Formik>
        </div>

        {/* Danger Zone */}
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 space-y-3">
          <h2 className="text-sm font-semibold text-destructive">Danger Zone</h2>
          <p className="text-sm text-muted-foreground">
            Deleting this project will also permanently delete all its tasks. This action cannot be undone.
          </p>
          <button
            id="delete-project-danger-btn"
            onClick={() => setConfirmDelete(true)}
            className="flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive/20 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Delete Project
          </button>
        </div>
      </div>

      {/* Confirm delete dialog */}
      <ConfirmDialog
        open={confirmDelete}
        title="Delete Project"
        description={`Are you sure you want to delete "${project.title}"? All tasks will also be deleted.`}
        confirmLabel="Delete permanently"
        isLoading={deleteProject.isPending}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </>
  );
};

export default ProjectSettingsPage;
