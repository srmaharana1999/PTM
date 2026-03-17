import { cn } from "@/lib/utils";
import {
  BookOpenCheckIcon,
  ClipboardPlus,
  LayoutDashboard,
  User,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navigation = [
  { name: "Over View", href: "/", icon: LayoutDashboard, key: "overview" },
  {
    name: "Task List",
    href: "/task_list",
    icon: BookOpenCheckIcon,
    key: "taskList",
  },
  {
    name: "Create Task",
    href: "/create_task",
    icon: ClipboardPlus,
    key: "createTask",
  },
  { name: "Profile", href: "/profile", icon: User, key: "profile" },
];

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar = ({ onClose }: SidebarProps) => {
  const { pathname } = useLocation();
  const params = pathname.split("/dashboard");
  return (
    <aside className="h-full bg-white/10 backdrop-blur-2xl border border-white/30 rounded-md flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4">
      {/* <div className=""> */}
      <div className="flex h-16 shrink-0 items-center justify-between">
        <h1 className="text-xl font-bold bg-linear-to-l from-white/50 to-chart-1 bg-clip-text text-transparent">
          PTM Dashboard
        </h1>
        <button
          type="button"
          className="lg:hidden -m-2.5 p-2.5 text-muted-foreground hover:text-foreground transition-colors"
          onClick={onClose}
        >
          <span className="sr-only">Close sidebar</span>
          <X className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      {/* Navigation */}
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="-mx-2 space-y-1">
          {navigation.map((item) => {
            const isActive = params.includes(item.href);
            return (
              <li key={item.key}>
                <Link
                  to={`/dashboard${item.href}`}
                  className={cn(
                    "group flex gap-x-3 rounded-lg p-2 text-sm font-semibold transition-colors",
                    isActive
                      ? "bg-white text-accent-foreground"
                      : "text-muted-foreground hover:bg-white/30 hover:text-accent-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {/* </div> */}
    </aside>
  );
};

export default Sidebar;
