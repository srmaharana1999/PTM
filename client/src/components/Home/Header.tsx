import { cn } from "@/lib/utils";
import { ArrowRight, MenuIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  {
    label: "Features",
    href: "#",
    end: true,
  },
  {
    label: "Dashboard",
    href: "/dashboard",
    end: true,
  },
  {
    label: "About",
    href: "/about",
    end: true,
  },
];

const Header = () => {
  const [open, setOpen] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScrolled = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScrolled);

    return () => window.removeEventListener("scroll", handleScrolled);
  }, []);
  console.log(scrolled);
  return (
    <nav
      className={cn(
        "sticky mx-auto inset-0 top-0 z-30",
        scrolled ? "w-full bg-white shadow-md" : "max-w-7xl",
      )}
    >
      <div
        // className="h-20 max-w-7xl mx-auto px-6 flex items-center justify-between"
        className={cn(
          "h-16 max-w-7xl mx-auto px-6 flex items-center justify-between",
        )}
      >
        <div className="bg-radial border-2 border-neutral-white from-violet-600 to-fuchsia-700 drop-shadow-sm drop-shadow-blue-400 w-fit h-12 aspect-square rounded-2xl flex items-center justify-center">
          <p className="font-bold text-transparent tracking-wide bg-clip-text bg-linear-to-br from-violet-100 via-fuchsia-100 to-violet-200">
            PTM
          </p>
        </div>
        <div className="flex text-sm items-center gap-10 max-md:hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.href}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "capitalize font-medium",
                  isActive
                    ? " text-violet-900 "
                    : "text-neutral-500 hover:text-neutral-900",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink
            to="login"
            className="capitalize font-medium text-neutral-500 hover:text-neutral-900"
          >
            Login
          </NavLink>
          <NavLink
            to="/register"
            className="bg-chart-1 drop-shadow-sm px-4 py-1.5 flex items-center gap-2 rounded-full"
          >
            <p>Get Started</p>
            <ArrowRight />{" "}
          </NavLink>
        </div>

        <button className="md:hidden" onClick={() => setOpen((pre) => !pre)}>
          {open ? (
            <MenuIcon className="text-neutral-900" />
          ) : (
            <X className="text-neutral-900" />
          )}
        </button>
      </div>
      <div
        className={cn(
          "absolute inset-x-0 flex flex-col md:hidden gap-6 py-6 items-center bg-linear-to-b from-violet-200 to-fuchsia-200 border-b border-t border-white/60 transition-transform origin-top ease-in-out duration-500",
          open ? "scale-y-0" : "scale-y-full",
        )}
      >
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.href}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "capitalize font-medium",
                isActive
                  ? " text-violet-900 "
                  : "text-neutral-500 hover:text-neutral-900",
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
        <NavLink
          to="login"
          className="capitalize font-medium text-neutral-500 hover:text-neutral-900"
        >
          Login
        </NavLink>
        <div className="bg-chart-1 drop-shadow-sm px-4 py-2 flex items-center rounded-full">
          <p>Get Started</p>
          <ArrowRight />{" "}
        </div>
        <div className="flex items-center gap-4"></div>
      </div>
    </nav>
  );
};

export default Header;
