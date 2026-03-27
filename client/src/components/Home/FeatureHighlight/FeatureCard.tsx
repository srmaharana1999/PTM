import { cn } from "@/lib/utils";
import { useState } from "react";

interface IFeatureCard {
  icon: React.ElementType;
  name: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, name, description }: IFeatureCard) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 400);
  };
  return (
    <div
      onClick={handleClick}
      className={cn(
        "bg-white max-w-xs rounded-3xl border border-gray-100 hover:shadow-lg p-6 group cursor-default hover:bg-linear-to-br from-fuchsia-600/20 hover:via-violet-50  via-transparent transition-all ease-in-out duration-600",
        clicked
          ? "scale-110 bg-linear-to-br via-violet-50   "
          : "scale-100 via-transparent",
      )}
    >
      <Icon className={cn("h-10 w-14 mb-4 text-neutral-500", clicked && "text-violet-600")} />
      <h5 className="text-xl font-medium mb-2 text-neutral-900">{name}</h5>
      <p className="text-neutral-600">{description}</p>
    </div>
  );
};

export default FeatureCard;
