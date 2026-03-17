import { MenuIcon } from "lucide-react";
import { useLocation } from "react-router-dom";

interface SidebarProps {
  onClose?: () => void;
}

const navigation = [
  {
    href: "/",
    message: "All Overview",
    key: "overview",
  },
  { href: "/profile", message: "Your Profile", key: "user" },
  {
    href: "/task_list",
    message: "All Task Record",
    key: "taskList",
  },
  {
    href: "/create_task",
    message: "Create a new Task",
    key: "createTask",
  },
];

const DashboardHeader = ({ onClose }: SidebarProps) => {
  const { pathname } = useLocation();
  const params = pathname.split("/dashboard");
  const navItem = navigation.find((item) => params.includes(item.href));
  return (
    <div className="shrink-0 flex items-center h-14 rounded-md gap-6">
      <button
        className="shrink-0 lg:hidden w-14 h-full bg-white rounded-2xl flex items-center justify-center"
        onClick={onClose}
      >
        <MenuIcon size={24} className="text-black cursor-pointer" />
      </button>
      <div className="flex grow h-full rounded-md items-center text-base capitalize  md:text-lg text-black bg-linear-to-tr  from-white to-white/60 backdrop-blur-2xl px-6">
        {navItem?.message ?? "Welcome to Dashboard !!!"}
      </div>
    </div>
  );
};

export default DashboardHeader;
