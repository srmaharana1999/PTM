import { NavLink } from "react-router-dom";

const CTASection = () => {
  return (
    <div className="bg-sky-100 text-center py-16 ">
      <h3 className="text-violet-900 text-3xl mb-2">
        Ready to take control of your projects?
      </h3>
      <p className="text-violet-500 mb-8">
        Jump straight into the dashboard and start tracking today.
      </p>
      <NavLink
        to="/dashboard"
        className="border border-neutral-500/80 backdrop-blur-2xl shadow-lg  block w-fit mx-auto hover:bg-black hover:text-white rounded-lg px-4 py-2 text-neutral-900"
      >
        Open Dashboard
      </NavLink>
    </div>
  );
};

export default CTASection;
