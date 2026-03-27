import {
  FolderKanban,
  Kanban,
  LayoutDashboard,
  ShieldCheckIcon,
  UserCircle,
  Users,
} from "lucide-react";
import FeatureCard from "./FeatureCard";

const features = [
  {
    name: "Dynamic Dashboard",
    description:
      "Real-time overview of all active projects, pending tasks, and recent team activity in one centralized view.",
    icon: LayoutDashboard,
  },
  {
    name: "Project Management",
    description:
      "Create, organize, and track complex development projects from start to finish with dedicated status monitoring.",
    icon: FolderKanban,
  },
  {
    name: "Kanban Task Board",
    description:
      "An intuitive drag-and-drop board to manage task flows (To Do, In Progress, Done) with priority labels.",
    icon: Kanban,
  },
  {
    name: "Team Collaboration",
    description:
      "Add members to specific projects, assign tasks to individuals, and manage roles for seamless teamwork.",
    icon: Users,
  },
  {
    name: "Secure Authentication",
    description:
      "Robust login and registration system featuring JWT-based security and persistent session management.",
    icon: ShieldCheckIcon,
  },
  {
    name: "Personalized Profiles",
    description:
      "Customize your user settings, track individual contributions, and manage account preferences efficiently.",
    icon: UserCircle,
  },
];

const FeatureHighlight = () => {
  return (
    <div className="bg-gray-50 py-16 md:py-20">
      <div className="max-w-6xl w-11/12 md:w-fit mx-auto">
        <div className="text-center fade-in-animation mb-10 md:mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h3 className="text-violet-600 font-semibold tracking-wider uppercase text-sm mb-4">
            Platform Features
          </h3>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 mb-6 tracking-tight">
            Everything you need to{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-600 to-fuchsia-600">
              stay on track
            </span>
          </h2>
          <p className="text-neutral-500 max-w-2xl mx-auto">
            Built for teams that move fast and need clarity. Our tools are
            designed to streamline your workflow and boost productivity.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-fit mx-auto gap-8 md:gap-10">
          {features.map((item) => (
            <FeatureCard
              key={item.name}
              name={item.name}
              description={item.description}
              icon={item.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureHighlight;
