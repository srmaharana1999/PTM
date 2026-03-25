import { Form, Formik } from "formik";
import { KeyRound } from "lucide-react";

import PasswordField from "../Fields/PasswordField";
import {
  changePasswordInitialValues,
  changePasswordSchema,
  type ChangePasswordValues,
} from "@/lib/schema/authSchema.ts";
import { extractErrorMessage } from "@/lib/utils";
import toast from "react-hot-toast";
import { useChangePassword } from "@/hooks/useAuth";

const ChangePasswordForm = () => {
  const changePassword = useChangePassword();
  const handleChangePassword = (
    values: ChangePasswordValues,
    { resetForm }: { resetForm: () => void },
  ) => {
    changePassword.mutate(values, {
      onSuccess: () => {
        toast.success("Password changed successfully!");
        resetForm();
      },
      onError: (err) => {
        toast.error(extractErrorMessage(err));
      },
    });
  };
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6">
      <div className="flex items-center gap-2 mb-5">
        <KeyRound className="h-4 w-4 text-violet-400" />
        <h2 className="text-sm font-semibold">Change Password</h2>
      </div>

      <Formik
        initialValues={changePasswordInitialValues}
        validationSchema={changePasswordSchema}
        onSubmit={handleChangePassword}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <PasswordField
              id="curr-password"
              label="Current Password"
              name="currPassword"
              isRequired
            />
            <PasswordField
              id="new-password"
              label="New Password"
              name="newPassword"
              isRequired
            />
            <PasswordField
              id="confirm-new-password"
              label="Confirm New Password"
              name="confirmNewPassword"
              isRequired
            />

            <button
              id="change-password-submit"
              type="submit"
              disabled={isSubmitting || changePassword.isPending}
              className="flex w-full items-center mt-6 justify-center gap-2 rounded-xl bg-linear-to-r from-violet-500 to-fuchsia-500 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {changePassword.isPending ? (
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>
                  <KeyRound className="h-4 w-4" />
                  Update Password
                </>
              )}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ChangePasswordForm;
