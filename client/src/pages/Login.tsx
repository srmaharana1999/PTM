import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { useAppDispatch } from "../app/hooks";
import { loginUser } from "../features/auth/authThunks";
import { Form, Formik } from "formik";
import InputField from "@/components/Fields/InputField";
import { initialValues, loginSchema, type loginTypes } from "@/lib/Schema/login";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";



const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (values: loginTypes,
    { resetForm }: { resetForm: () => void }
  ) => {
    setLoading(true);
    const payload = { email: values.email, password: values.password }

    try {
      await toast.promise(
        dispatch(loginUser(payload)),
        {
          loading: "Logging in...",
          success: "Login Successful! Welcome back",
          error: (err) => {
            // Extract error message from axios error
            const axiosError = err as AxiosError<{ message?: string }>;
            return axiosError?.response?.data?.message || "Login Failed. Please try again.";
          }
        }
      );
      setTimeout(() => navigate("/dashboard"), 1000);
      resetForm();
    } catch {
      // Error already shown by toast.promise
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="max-w-lg w-11/12 md:w-full p-6 md:p-10 bg-white/10 border  border-white/20">
        <h1 className="text-3xl text-center">Login</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          <Form className="my-6 space-y-6">
            <InputField name="email" type="email" placeHolder="xyz@domain" label="Email" />
            <InputField name="password" type="password" placeHolder="*******" label="Password" />
            <Button type="submit" className={`w-full py-2 rounded bg-white/10 mt-6 border border-white/20 hover:bg-white hover:text-black hover:cursor-pointer`}>
              {loading ? "Logging..." : "Login"}
            </Button>
          </Form>
        </Formik>

        <p className="text-sm text-center text-gray-400">
          No account ?{" "}
          <Link to="/register" className="hover:text-blue-600">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
