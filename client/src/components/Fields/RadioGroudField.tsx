import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useField } from "formik";
import clsx from "clsx";

interface IRadioGroupFieldProps {
  options: { value: string; label: string }[];
  label?: string;
  id: string;
  isRequired?: boolean;
  name: string;
}

const RadioGroupField = ({
  options,
  label,
  id,
  isRequired,
  name,
}: IRadioGroupFieldProps) => {
  const [field, meta, helpers] = useField(name);

  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm mb-1.5 text-gray-400">
          {label}
          {isRequired && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      <RadioGroup
        id={id}
        value={field.value}
        onValueChange={(val) => {
          helpers.setValue(val, true);
          helpers.setTouched(true, false);
        }}
        className={clsx(
          "rounded-md border border-white/10 bg-white/3 px-4 py-3 transition-all duration-300 focus-within:border-violet-500/40 focus-within:ring-2 focus-within:ring-violet-500/10",
          meta.touched && meta.error ? "border-red-500/50 bg-red-500/2" : ""
        )}
      >
        {options.map((option) => (
          <div
            key={option.value}
            className="group flex items-center gap-3 transition-all active:scale-95"
          >
            <div className="relative flex items-center justify-center">
              <RadioGroupItem
                value={option.value}
                id={`${id}-${option.value}`}
                className={clsx(
                  "border-white/20 bg-transparent transition-all hover:border-violet-500/60 focus:ring-violet-500/20 data-[state=checked]:border-violet-500 data-[state=checked]:text-violet-500"
                )}
              />
            </div>
            <label
              htmlFor={`${id}-${option.value}`}
              className="cursor-pointer text-sm text-gray-400 transition-colors hover:text-gray-200 group-hover:text-gray-200"
            >
              {option.label}
            </label>
          </div>
        ))}
      </RadioGroup>
      {meta.touched && meta.error && (
        <p className="mt-1 text-xs text-red-500">{meta.error}</p>
      )}
    </div>
  );
};

export default RadioGroupField;
