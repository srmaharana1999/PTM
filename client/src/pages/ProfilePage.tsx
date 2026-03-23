import { useState } from "react";
import { User, Mail, ShieldCheck, Copy, Check } from "lucide-react";
import { useGetMe } from "@/hooks/useAuth";
import { useAppSelector } from "@/app/hooks";
import { LoadingSpinner, ErrorMessage } from "@/components/shared";
import toast from "react-hot-toast";
import ChangePasswordForm from "@/components/user/ChangePasswordForm";

const ProfilePage = () => {
  const { user: authUser } = useAppSelector((s) => s.auth);
  const { data, isLoading, isError, error } = useGetMe();
  const [copied, setCopied] = useState(false);

  const me = data?.data ?? authUser;

  const handleCopyId = () => {
    if (!me?._id) return;
    navigator.clipboard.writeText(me._id).then(() => {
      setCopied(true);
      toast.success("User ID copied!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" label="Loading profile…" />
      </div>
    );
  }

  if (isError) {
    return <ErrorMessage error={error} className="max-w-sm mx-auto mt-10" />;
  }

  return (
    <div className="max-w-xl space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          View your account details and change your password.
        </p>
      </div>

      {/* ── Profile info card ──────────────────────────────── */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 space-y-5">
        {/* Avatar + name */}
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-violet-500 to-fuchsia-500 text-2xl font-bold text-white shadow-lg shadow-violet-500/30">
            {me?.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <p className="text-lg font-bold">{me?.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              {me?.role === "admin" ? (
                <ShieldCheck className="h-3.5 w-3.5 text-violet-400" />
              ) : null}
              <span className="text-sm text-muted-foreground capitalize">
                {me?.role ?? "user"}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10" />

        {/* Email row */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 border border-white/10">
            <Mail className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-0.5">
              Email
            </p>
            <p className="text-sm font-medium truncate">{me?.email}</p>
          </div>
        </div>

        {/* User ID row — copyable (used for adding to projects) */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 border border-white/10">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-0.5">
              Your User ID
            </p>
            <p className="text-sm font-mono truncate text-muted-foreground">
              {me?._id ?? "—"}
            </p>
          </div>
          <button
            onClick={handleCopyId}
            title="Copy User ID"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-muted-foreground hover:text-violet-400 hover:border-violet-500/30 transition-colors"
            aria-label="Copy User ID"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>
      <ChangePasswordForm />
    </div>
  );
};

export default ProfilePage;
