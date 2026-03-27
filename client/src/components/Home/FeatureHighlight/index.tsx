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
    <div className="bg-linear-to-b from-violet-100  to-white pt-10 pb-20">
      <div className="max-w-6xl w-11/12 md:w-fit mx-auto">
        <h3 className="text-neutral-700 text-2xl mb-2">
          Everything you need to stay on track
        </h3>
        <p className="text-neutral-600 mb-16">
          Built for teams that move fast and need clarity.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-fit mx-auto gap-10">
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
