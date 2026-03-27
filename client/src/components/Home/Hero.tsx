import { LucideChevronsDown } from "lucide-react";
import { NavLink } from "react-router-dom";

const Hero = () => {
  return (
    <div className="text-black pt-20 mx-auto flex flex-col gap-8 bg-linear-to-b from-fuchsia-100 via-violet-100 to-white pb-16 md:pb-20">
      <div className=" bg-blue-200/60 border shadow-sm mt-10 border-blue-300/50 py-0.5 pr-4 rounded-full mx-auto w-fit ">
        <p className="text-blue-500 font-semibold relative before:absolute pl-8 before:top-1/3 before:left-3 before:rounded before:bg-violet-600 before:content[''] before:h-2 before:w-2">
          Project Tracking Manager
        </p>
      </div>
      <div className="max-w-7xl w-11/12 mx-auto fade-in-animation">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium text-center text-neutral-700 text-shadow-sm mb-3">
          Track every project.
        </h1>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium text-violet-800 text-shadow-sm text-center">
          Ship with confidence.
        </h1>
        <p className="max-w-lg sm:text-lg leading-relaxed text-neutral-700 text-center mx-auto mt-6">
          A centralized dashboard to manage tasks, monitor progress, and keep
          your team aligned - from kickoff to delivery.
        </p>
      </div>
      <div className="flex max-sm:flex-col items-center mx-auto gap-6 my-4 md:my-8 fade-in-animation">
        <NavLink
          to="/dashboard"
          className="px-4 py-1.5 flex items-center justify-evenly text-white bg-linear-to-br opacity-90 hover:opacity-100 from-blue-600 to-pink-400 gap-2 w-fit shadow-md backdrop-blur-3xl  rounded-md"
        >
          Go To Dashboard
        </NavLink>
        <NavLink
          to="#"
          className="px-2 py-1.5 flex items-center justify-evenly hover:bg-pink-200/30 border shadow-md backdrop-blur-3xl border-neutral-700 rounded-md"
        >
          <p>See How it Works</p>
          <LucideChevronsDown />
        </NavLink>
      </div>
      <div className="shadow-2xl max-w-5xl rounded-3xl overflow-hidden w-11/12 mx-auto relative z-10 animate-in fade-in zoom-in-95 duration-1000 border-8 border-white">
        <img src="/src/assets/dashboard.png" alt="ptm_dashboard_snapshot" />
      </div>
    </div>
  );
};

export default Hero;
