import clsx from "clsx";
import { useField } from "formik";

interface IProps {
  label?: string;
  name: string;
  placeholder?: string;
  id: string;
  isRequired: boolean;
  rows?: number;
}
const TextAreaField = ({
  label,
  name,
  placeholder,
  id,
  isRequired,
  rows,
}: IProps) => {
  const [field, meta] = useField(name);
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id}>
          {label}
          {isRequired && <span className="text-destructive">*</span>}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        placeholder={placeholder}
        {...field}
        className={clsx(
          "w-full rounded-md mt-1 border border-white/10 bg-white/5 px-4 py-2.5 text-sm placeholder:text-muted-foreground outline-none transition-all focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20",
          meta.touched && meta.error ? "border-red-500" : "",
        )}
      />
      {meta.touched && meta.error && (
        <p className=" text-xs text-red-500">{meta.error}</p>
      )}
    </div>
  );
};

export default TextAreaField;
