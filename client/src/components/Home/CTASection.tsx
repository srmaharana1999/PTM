import { ArrowRight } from "lucide-react";
import { NavLink } from "react-router-dom";

const CTASection = () => {
  return (
    <div className="bg-neutral-900 py-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-linear-to-r from-violet-600/30 to-fuchsia-600/30 blur-[100px] rounded-full" />

      <div className="max-w-4xl mx-auto px-6 text-center fade-in-animation">
        <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
          Ready to take control of your projects?
        </h3>
        <p className="text-neutral-400 mb-12 max-w-lg mx-auto leading-relaxed">
          Jump straight into the dashboard and <br /> start tracking today.
        </p>
        <NavLink
          to="/dashboard"
          className="group bg-white text-neutral-900 font-bold px-6 py-2 rounded-full inline-flex items-center gap-2 hover:bg-neutral-100 transition-all hover:scale-105 active:scale-95 shadow-xl hover:shadow-white/10"
        >
          <span>Open Your Dashboard</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </NavLink>
      </div>
    </div>
  );
};

export default CTASection;
