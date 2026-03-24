import { useState, useEffect } from "react";
import { X, UserPlus } from "lucide-react";
import { useAddMembers } from "@/hooks/useMember";
import { ProjectRole } from "@/lib/types";
import { extractErrorMessage } from "@/lib/utils";
import toast from "react-hot-toast";
import useDebounce from "@/hooks/useDebounce";

import { Checkbox } from "../ui/checkbox";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSearchUsers } from "@/hooks/useAuth";
import { useAppSelector } from "@/app/hooks";

interface AddMemberModalProps {
  open: boolean;
  projectId: string;
  onClose: () => void;
}

const AddMemberModal = ({ open, projectId, onClose }: AddMemberModalProps) => {
  const addMembers = useAddMembers(projectId);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<ProjectRole>(ProjectRole.MEMBER);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const dQuery = useDebounce(query);

  const { data: users } = useSearchUsers(dQuery);

  const { user: loginUser } = useAppSelector((s) => s.auth);

  const usersWithOutMe = users?.data?.filter(
    (user) => user.email !== loginUser?.email,
  );

  const filteredUsers =
    usersWithOutMe?.filter(
      (user) =>
        user.name.toLowerCase().includes(dQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(dQuery.toLowerCase()),
    ) || [];

  const handleClick = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!open) return null;

  const handleSubmit = () => {
    if (selectedIds.size === 0) return;

    const data = Array.from(selectedIds).map((userId) => ({
      userId,
      role,
    }));

    addMembers.mutate(data, {
      onSuccess: () => {
        toast.success(
          selectedIds.size === 1
            ? "Member added!"
            : `${selectedIds.size} members added!`,
        );
        onClose();
      },
      onError: (err) => {
        toast.error(extractErrorMessage(err));
      },
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl border overflow-hidden border-white/15 bg-background/95 backdrop-blur-2xl shadow-2xl animate-in zoom-in-95 fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 bg-white/5 py-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-violet-400" />
            <h2 className="text-base text-gray-400">Add Members</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-col p-4">
          <input
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search members by name or email"
            className="w-full shrink-0 rounded-md border border-white/10 bg-white/5 px-4 py-2.5 text-sm placeholder:text-muted-foreground outline-none transition-all focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
          />
          <p className="text-xs my-2 text-center italic text-gray-600">
            --scroll to view more--
          </p>

          <div className="max-h-64 overflow-y-scroll no-scrollbar py-2">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleClick(user._id)}
                  className="grid grid-cols-[auto_1fr_1fr] items-center rounded-md cursor-pointer mb-1 bg-white/5 py-1.5 px-4 hover:bg-violet-500/20"
                >
                  <div className="w-10">
                    <Checkbox
                      checked={selectedIds.has(user._id)}
                      onCheckedChange={() => handleClick(user._id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <span className="text-xs font-medium truncate capitalize">
                    {user.name}
                  </span>
                  <span className="text-xs text-gray-400 truncate">
                    {user.email}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center py-6 text-xs text-muted-foreground italic">
                No users found matching "{query}"
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2 mt-2 items-center">
            <p className=" text-gray-600 text-xs">
              Select Role for selected members
            </p>
            <RadioGroup
              value={role}
              onValueChange={(val) => setRole(val as ProjectRole)}
              className="flex text-sm text-gray-400 items-center gap-4"
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem
                  className="bg-transparent"
                  value={ProjectRole.ADMIN}
                  id="admin"
                />
                <label className="text-xs" htmlFor="admin">
                  Admin
                </label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem
                  className="bg-transparent"
                  value={ProjectRole.MEMBER}
                  id="member"
                />
                <label className="text-xs" htmlFor="member">
                  Member
                </label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/15 bg-white/5 py-2.5 text-sm font-medium hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            id="add-members-submit"
            onClick={handleSubmit}
            disabled={addMembers.isPending || selectedIds.size === 0}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {addMembers.isPending ? (
              <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Add{" "}
                {selectedIds.size > 1
                  ? `${selectedIds.size} Members`
                  : "Member"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;
