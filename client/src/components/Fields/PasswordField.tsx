import { useField } from "formik";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";

interface IPasswordProps {
  label?: string;
  name: string;
  placeholder?: string;
  id: string;
  isRequired: boolean;
}

const PasswordField = ({ name, label, isRequired, id }: IPasswordProps) => {
  const [field, meta] = useField(name);
  const [showPass, setShowPass] = useState(false);
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm mb-1">
          {label}
          {isRequired && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <Input
          id={id}
          type={showPass ? "text" : "password"}
          placeholder="••••••••"
          {...field}
          className={`w-full rounded-md border bg-white/5 px-4 py-2.5 pr-11 text-sm placeholder:text-muted-foreground outline-none transition-all focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 ${
            meta.touched && meta.error
              ? "border-destructive/60"
              : "border-white/15"
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPass((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label={showPass ? "Hide password" : "Show password"}
        >
          {showPass ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
      {meta.touched && meta.error && (
        <p className="mt-1 text-xs text-destructive">{meta.error}</p>
      )}
    </div>
  );
};

export default PasswordField;
