import { Input } from "@/components/ui/input";
import clsx from "clsx";
import { useField } from "formik";

interface IProps {
  label?: string;
  name: string;
  type: string;
  placeHolder?: string;
}
const InputField = ({ label, name, type = "text", placeHolder }: IProps) => {
  const [field, meta] = useField(name);
  return (
    <div className="w-full">
      {label && <label className="">{label}</label>}
      <Input
        id={name}
        type={type}
        placeholder={placeHolder}
        {...field}
        className={clsx(
          "mt-2 rounded-none",
          meta.touched && meta.error ? "border-red-500" : ""
        )}
      />
      {meta.touched && meta.error && (
        <p className="mt-1 text-xs text-red-500">{meta.error}</p>
      )}
    </div>
  );
};

export default InputField;