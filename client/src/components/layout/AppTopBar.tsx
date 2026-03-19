import { Menu } from "lucide-react";
import { useAppSelector } from "@/app/hooks";
import { getInitials } from "@/lib/utils";

interface AppTopBarProps {
  onMobileMenuToggle: () => void;
  pageTitle?: string;
}

const AppTopBar = ({ onMobileMenuToggle, pageTitle }: AppTopBarProps) => {
  const { user } = useAppSelector((s) => s.auth);

  return (
    <header className="flex items-center h-16 px-4 border-b border-white/10 bg-white/3 backdrop-blur-sm shrink-0 gap-4">
      {/* Mobile menu trigger */}
      <button
        onClick={onMobileMenuToggle}
        className="lg:hidden flex items-center justify-center h-8 w-8 rounded-lg border border-white/15 bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
        aria-label="Toggle sidebar"
      >
        <Menu className="h-4 w-4" />
      </button>
      {/* Page title */}
      <div className="flex-1">
        {pageTitle && (
          <h1 className="text-sm font-semibold text-foreground">{pageTitle}</h1>
        )}
      </div>
      {/* User avatar chip */}
      {user && (
        <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 p-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-fuchsia-500 text-[10px] font-bold text-white">
            {getInitials(user.name)}
          </div>
          <span className="hidden sm:block text-xs font-medium text-muted-foreground">
            {user.name}
          </span>
        </div>
      )}
    </header>
  );
};

export default AppTopBar;
