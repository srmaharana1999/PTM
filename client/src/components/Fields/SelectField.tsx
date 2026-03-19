import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import clsx from "clsx";
import { useField } from "formik";

interface ISelectProps {
  label?: string;
  name: string;
  placeholder?: string;
  id: string;
  isRequired?: boolean;
  options: { value: string; label: string }[];
}

const SelectField = ({
  label,
  name,
  placeholder,
  id,
  options,
  isRequired,
}: ISelectProps) => {
  const [field, meta, helpers] = useField(name);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm mb-1">
          {label}
          {isRequired && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      {/* Controlled via value + onValueChange — the only way shadcn Select works with Formik */}
      <Select
        value={field.value}
        onValueChange={(val) => {
          helpers.setValue(val, true);
          helpers.setTouched(true, false);
        }}
      >
        <SelectTrigger
          id={id}
          className={clsx(
            "w-full rounded-md border border-white/10 bg-white/5 px-4 py-2.5 text-sm placeholder:text-muted-foreground outline-none transition-all focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20",
            meta.touched && meta.error ? "border-red-500/60" : "",
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="cursor-pointer capitalize"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {meta.touched && meta.error && (
        <p className="mt-1 text-xs text-red-500">{meta.error}</p>
      )}
    </div>
  );
};

export default SelectField;
