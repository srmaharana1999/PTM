import { useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import { ArrowLeft, FolderPlus } from "lucide-react";
import { useCreateProject } from "@/hooks/useProjects";
import {
  projectSchema,
  initialValues,
  type ProjectValues,
} from "@/lib/schema/projectSchema";
import { extractErrorMessage } from "@/lib/utils";
import toast from "react-hot-toast";
import InputField from "@/components/Fields/InputField";
import TextAreaField from "@/components/Fields/TextAreaField";
import { useUsers } from "@/hooks/useAuth";
import SelectWithInput from "@/components/Fields/SelectWithInput";
import { useAppSelector } from "@/app/hooks";

const CreateProjectPage = () => {
  const navigate = useNavigate();
  const createProject = useCreateProject();
  const { data, isLoading, isError } = useUsers();
  const { user: loginUser } = useAppSelector((s) => s.auth);

  const usersWithOutMe = data?.data?.filter(
    (user) => user.email !== loginUser?.email,
  );

  const handleSubmit = async (values: ProjectValues) => {
    console.log(values);
    createProject.mutate(values, {
      onSuccess: (res) => {
        toast.success(`"${res.data?.title}" created!`);
        navigate("/projects");
      },
      onError: (err) => {
        toast.error(extractErrorMessage(err));
      },
    });
  };

  return (
    <div className="max-w-xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/projects")}
          className="flex items-center justify-center h-8 w-8 rounded-xl border border-white/15 bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
          aria-label="Back to projects"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">New Project</h1>
          <p className="text-sm text-muted-foreground">
            Fill in the details below
          </p>
        </div>
      </div>

      {/* Form card */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
        <Formik
          initialValues={initialValues}
          validationSchema={projectSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              {/* Title */}
              <InputField
                label="Title"
                id="proj-title"
                placeholder="My Awesome Project"
                name="title"
                type="text"
                isRequired
              />
              <TextAreaField
                label="Description"
                id="proj-description"
                placeholder="What is this project about?"
                name="description"
                rows={4}
                isRequired
              />
              {isError && (
                <p className="text-xs text-red-500">
                  Failed to load users. Please refresh the page.
                </p>
              )}
              {!isLoading && !isError && (
                <SelectWithInput
                  label="Members"
                  placeholder="Click to open dialog box"
                  id="proj-members"
                  name="members"
                  options={usersWithOutMe}
                  isRequired
                />
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/projects")}
                  className="flex-1 rounded-xl border border-white/15 bg-white/5 py-2.5 text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="create-project-submit"
                  type="submit"
                  disabled={isSubmitting || createProject.isPending}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 py-2.5 text-sm font-semibold text-white shadow-lg hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {createProject.isPending ? (
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : (
                    <>
                      <FolderPlus className="h-4 w-4" />
                      Create Project
                    </>
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateProjectPage;
