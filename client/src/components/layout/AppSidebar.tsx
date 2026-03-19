import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  User,
  LogOut,
  X,
  ChevronRight,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { logoutUser } from "@/features/auth/authThunks";
import { getInitials } from "@/lib/utils";
import toast from "react-hot-toast";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Projects",
    href: "/projects",
    icon: FolderKanban,
    end: false,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: User,
    end: true,
  },
];

interface AppSidebarProps {
  onClose?: () => void;
}

const AppSidebar = ({ onClose }: AppSidebarProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      navigate("/login", { replace: true });
    } catch {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <aside className="h-full flex flex-col bg-white/5 backdrop-blur-2xl border-r border-white/10">
      {/* ── Logo ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-violet-500 to-fuchsia-500 shadow-lg">
            <Layers className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-bold tracking-wide bg-linear-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
            PTM
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden rounded-lg p-1 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ── Navigation ──────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Navigation
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.end}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-linear-to-r from-violet-500/20 to-fuchsia-500/10 text-foreground border border-violet-500/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/8",
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive
                      ? "text-violet-400"
                      : "text-muted-foreground group-hover:text-foreground",
                  )}
                />
                {item.label}
                {isActive && (
                  <ChevronRight className="ml-auto h-3 w-3 text-violet-400" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── User + Logout ────────────────────────────────────── */}
      <div className="shrink-0 border-t border-white/10 p-3 space-y-1">
        {user && (
          <div className="flex items-center gap-3 rounded-lg px-3 py-2 bg-white/5 border border-white/10">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-fuchsia-500 text-xs font-bold text-white">
              {getInitials(user.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">{user.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex w-full items-center cursor-pointer gap-3 rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
