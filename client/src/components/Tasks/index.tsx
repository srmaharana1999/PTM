import { useRef } from "react";
import TaskCard from "./TaskCard";
import { FaArrowAltCircleRight } from "react-icons/fa";
import Filter from "./Filter";

const Tasks = () => {
  const searchRef = useRef<HTMLInputElement>(null);
  return (
    <div>
      <div className="">
        <div className="flex items-center gap-4 mt-4">
          <div
            className="max-w-xl flex items-center justify-between w-full bg-white/10 backdrop-blur-md p-2 border border-white/20 rounded-full focus-within:border-white/40 focus-within:ring-1 focus-within:ring-white/80"
            onClick={() => searchRef.current?.focus()}
          >
            <input
              ref={searchRef}
              type="text"
              placeholder="Search Your Task"
              className="w-full focus:outline-none pl-2"
            />
            <FaArrowAltCircleRight className="text-white/40 shrink-0 text-3xl hover:text-white hover:cursor-pointer focus-within:text-white" />
          </div>
          <Filter />
        </div>
        <p className="text-white/70 my-4">
          Total <strong>5</strong> tasks
        </p>
      </div>
      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TaskCard />
        <TaskCard />
        <TaskCard />
        <TaskCard />
        <TaskCard />
        <TaskCard />
        <TaskCard />
        <TaskCard />
        <TaskCard />
        <TaskCard />
      </div>
    </div>
  );
};

export default Tasks;
