import type { IconType } from "react-icons";

interface StatisticsTileProps {
  title: string;
  value: string;
  icon: IconType;
}
const StatisticsTile = ({ title, value, icon: Icon }: StatisticsTileProps) => {
  return (
    <div className="flex items-center justify-between p-6 bg-white text-neutral-800 rounded-2xl shadow-md hover:shadow-xl hover:text-blue-600 group ">
      <div className="text-xl">
        <h2 className="font-bold mb-2">{title}</h2>
        <h4>{value}</h4>
      </div>
      <Icon
        className="shrink-0 group-hover:rotate-12 transition-transform duration-500 ease-out"
        size={42}
      />
    </div>
  );
};

export default StatisticsTile;
