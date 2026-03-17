import { CircleCheckBigIcon, ClockAlertIcon, LayoutList } from "lucide-react";
import StatisticsTile from "./StatisticsTile";
import { GrInProgress } from "react-icons/gr";
import { FaTasks } from "react-icons/fa";

const OverView = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatisticsTile title="Total Tasks" value="50" icon={FaTasks} />
      <StatisticsTile title="Active Tasks" value="20" icon={LayoutList} />
      <StatisticsTile title="Due Tasks" value="10" icon={ClockAlertIcon} />
      <StatisticsTile
        title="In Progress Tasks"
        value="10"
        icon={GrInProgress}
      />
      <StatisticsTile
        title="Completed Tasks"
        value="10"
        icon={CircleCheckBigIcon}
      />
    </div>
  );
};

export default OverView;
