import * as Yup from "yup";

export const initialValues = {
    name:"",
    email:"",
    password:"",
    confirmPassword:""
}  

export const registerSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
                .min(8, 'Password must be at least 8 characters')
                .matches(/[A-Z]/, 'Password must contain an uppercase letter')
                .matches(/[a-z]/, 'Password must contain a lowercase letter')
                .matches(/[0-9]/, 'Password must contain a number')
                .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain a special character')
                .required('Password is required'),
    confirmPassword:Yup.string().oneOf([Yup.ref("password")],"Passwords must match").required("Confirm Password is required")
});

export type registerTypes = Yup.InferType<typeof registerSchema>