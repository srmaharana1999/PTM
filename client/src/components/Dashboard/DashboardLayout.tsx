import { useState } from "react";
import Sidebar from "./SideBar";
import DashboardHeader from "./DashboardHeader";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-[calc(100vh-100px)] mx-4 relative mt-22">
      <div className="absolute inset-y-0 left-0 z-30 w-64 hidden lg:block">
        <Sidebar />
      </div>
      {/* Mobile sidebar overlay */}
      <div
        className={`lg:hidden ${mobileMenuOpen ? "absolute inset-0 z-50" : "pointer-events-none"}`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity duration-300 ease-in-out rounded-2xl ${
            mobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Sidebar with slide animation */}
        <div
          className={`absolute inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-200"
          }`}
        >
          <Sidebar onClose={() => setMobileMenuOpen(false)} />
        </div>
      </div>
      <div className="lg:pl-68  flex flex-col absolute inset-0">
        <DashboardHeader onClose={() => setMobileMenuOpen((pre) => !pre)} />
        <main className="grow w-full overflow-y-auto p-6 mt-4 bg-linear-to-br border border-white/30 from-white/10 via-white/20 to-white/5 backdrop-blur-3xl rounded-md">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
