import * as Yup from "yup";

export const initialValues = {
    email:"",
    password:""
}  

export const loginSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
});

export type loginTypes = Yup.InferType<typeof loginSchema>