import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import { Layers, LogIn } from "lucide-react";
import { useAppDispatch } from "@/app/hooks";
import { loginUser } from "@/features/auth/authThunks";
import {
  loginSchema,
  initialValues,
  type loginTypes,
} from "@/lib/schema/login.ts";
import { extractErrorMessage } from "@/lib/utils";
import toast from "react-hot-toast";
import InputField from "@/components/Fields/InputField";
import PasswordField from "@/components/Fields/PasswordField";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [serverError, setServerError] = useState<string | null>(null);

  const handleSubmit = async (
    values: loginTypes,
    { resetForm }: { resetForm: () => void },
  ) => {
    setServerError(null);
    try {
      await dispatch(
        loginUser({ email: values.email, password: values.password }),
      );
      toast.success("Welcome back!");
      resetForm();
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setServerError(extractErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Ambient gradient blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/30">
              <Layers className="h-6 w-6 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight">
                Welcome back
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Sign in to your PTM account
              </p>
            </div>
          </div>

          {/* Server error */}
          {serverError && (
            <div className="mb-5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {serverError}
            </div>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-5">
                {/* Email */}

                <InputField
                  id="login-email"
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  isRequired={true}
                />
                <PasswordField
                  id="login-password"
                  label="Password"
                  name="password"
                  placeholder="••••••••"
                  isRequired={true}
                />

                {/* Submit */}
                <button
                  id="login-submit"
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-violet-500 to-fuchsia-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {isSubmitting ? (
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : (
                    <>
                      <LogIn className="h-4 w-4" />
                      Sign In
                    </>
                  )}
                </button>
              </Form>
            )}
          </Formik>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            No account?{" "}
            <Link
              to="/register"
              className="font-semibold text-violet-400 hover:text-violet-300 transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
