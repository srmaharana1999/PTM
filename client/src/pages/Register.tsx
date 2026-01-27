import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { useAppDispatch } from "../app/hooks";
import { registerUser } from "../features/auth/authThunks";
import { Form, Formik } from "formik";
import { initialValues, registerSchema, type registerTypes } from "@/lib/Schema/register";
import InputField from "@/components/Fields/InputField";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: registerTypes,
    {resetForm}:{resetForm:()=>void}
  ) => {
    setLoading(true);
    const payload = {email:values.email,name:values.name,password:values.password}
    
    try {
      await toast.promise(
        dispatch(registerUser(payload)),
        {
          loading: "Registering...",
          success: "Registration Successful! Redirecting to login",
          error: (err) => {
            // Extract error message from axios error
            const axiosError = err as AxiosError<{ message?: string }>;
            return axiosError?.response?.data?.message || "Registration Failed. Please try again";
          }
        }
      );
      setTimeout(() => navigate("/login"), 1000);
      resetForm();
    } catch {
      // Error already shown by toast.promise
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full h-screen mt-20 flex items-center justify-center">
      <div className="max-w-lg w-11/12 md:w-full p-6 md:p-10 bg-white/10 border border-white/20">
        <h1 className="text-3xl text-center">Register</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={registerSchema}
          onSubmit={handleSubmit}
        >
          <Form className="my-6 space-y-6">
              <InputField name="name" type="text" placeHolder="Enter Full Name" label="Name"/>  
              <InputField name="email" type="email" placeHolder="xyz@domain" label="Email"/>
              <InputField name="password" type="password" placeHolder="*******" label="Password"/>
              <InputField name="confirmPassword" type="password" placeHolder="*******" label="Confirm Password"/>
              <Button type="submit" className={`w-full py-2 rounded bg-white/10 mt-6 border border-white/20 hover:bg-white hover:text-black hover:cursor-pointer`}>
                {loading ? "Registering..." : "Register"}
              </Button>
          </Form>
        </Formik>
        <p className="text-sm text-center text-gray-400">
          Already have an account ?{" "}
          <Link to="/login" className="hover:text-blue-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
