import { CheckIcon, ChevronsUpDown, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useState } from "react";
import { useField } from "formik";

import { cn } from "@/lib/utils";

interface IOptions {
  _id: string;
  name: string;
  email: string;
}

interface ICommandProps {
  label?: string;
  name: string;
  placeholder?: string;
  isRequired?: boolean;
  id: string;
  options: IOptions[] | undefined;
}

export default function SelectWithInput({
  label,
  placeholder = "Search members...",
  id,
  isRequired,
  name,
  options,
}: ICommandProps) {
  const [open, setOpen] = useState(false);
  const [field, meta, helpers] = useField<string[]>(name);
  const safeOptions = options ?? [];
  const selectedIds: string[] = Array.isArray(field.value) ? field.value : [];
  const selectedUsers = safeOptions.filter((o) => selectedIds.includes(o._id));

  const toggle = (userId: string) => {
    const next = selectedIds.includes(userId)
      ? selectedIds.filter((id) => id !== userId)
      : [...selectedIds, userId];
    helpers.setValue(next, true);
    helpers.setTouched(true, false);
  };

  const remove = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    helpers.setValue(
      selectedIds.filter((id) => id !== userId),
      true,
    );
    helpers.setTouched(true, false);
  };

  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm mb-1">
          {label}
          {isRequired && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            role="combobox"
            aria-expanded={open}
            type="button"
            className={cn(
              "w-full min-h-10 h-auto flex flex-wrap items-center gap-1.5 justify-start mt-1 rounded-md text-left border bg-white/5 border-white/20 px-3 py-2 text-sm outline-none transition-all",
              open
                ? "border-violet-500/60 ring-2 ring-violet-500/20"
                : "hover:border-white/30",
              meta.touched && meta.error && "border-red-500/60",
            )}
          >
            {/* Selected chips */}
            {selectedUsers.length > 0 ? (
              <>
                {selectedUsers.map((user) => (
                  <span
                    key={user._id}
                    className="inline-flex items-center gap-1 rounded-md bg-violet-500/20 border border-violet-500/30 px-2 py-0.5 text-xs text-violet-200 font-medium"
                  >
                    {user.name}
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => remove(user._id, e)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          helpers.setValue(
                            selectedIds.filter((id) => id !== user._id),
                          );
                        }
                      }}
                      className="ml-0.5 rounded hover:text-white cursor-pointer"
                      aria-label={`Remove ${user.name}`}
                    >
                      <X className="h-3 w-3" />
                    </span>
                  </span>
                ))}
              </>
            ) : (
              <span className="text-white/40">{placeholder}</span>
            )}

            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 text-white/40" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          sideOffset={4}
          className="w-(--radix-popover-trigger-width) border-0 p-0"
        >
          <Command className="**:data-[slot=command-input-wrapper]:h-11 bg-black/80">
            <CommandInput placeholder={placeholder} />
            <CommandList className="p-1 my-scrollbar">
              <CommandEmpty>No members found</CommandEmpty>
              <CommandGroup>
                {safeOptions.map((option) => {
                  const isSelected = selectedIds.includes(option._id);
                  return (
                    <CommandItem
                      key={option._id}
                      value={option._id}
                      keywords={[option.name, option.email]}
                      onSelect={() => toggle(option._id)}
                      className={cn(
                        "rounded-md cursor-pointer mb-1",
                        isSelected && "bg-violet-500/20",
                      )}
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/30 text-xs font-semibold text-violet-200 mr-2">
                        {option.name.charAt(0).toUpperCase()}
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium truncate">
                          {option.name}
                        </span>
                        <span className="text-xs text-gray-400 truncate">
                          {option.email}
                        </span>
                      </div>
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4 shrink-0 text-violet-400 transition-opacity",
                          isSelected ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>

            {/* Footer: show count + clear all */}
            {selectedUsers.length > 0 && (
              <div className="flex items-center justify-between border-t border-white/10 px-3 py-2">
                <span className="text-xs text-white/40">
                  {selectedUsers.length} member
                  {selectedUsers.length > 1 ? "s" : ""} selected
                </span>
                <button
                  type="button"
                  onClick={() => {
                    helpers.setValue([], true);
                    helpers.setTouched(true, false);
                  }}
                  className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                >
                  Clear all
                </button>
              </div>
            )}
          </Command>
        </PopoverContent>
      </Popover>

      {meta.touched && meta.error && (
        <p className="mt-1 text-xs text-red-500">
          {typeof meta.error === "string" ? meta.error : "Invalid selection"}
        </p>
      )}
    </div>
  );
}
