import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { logoutUser } from "@/features/auth/authThunks";
import { cn, getInitials } from "@/lib/utils";
import { ArrowRight, LogOutIcon, MenuIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      navigate("/login", { replace: true });
    } catch {
      toast.error("Logout failed. Please try again.");
    }
  };
  return (
    <nav
      className={cn(
        "fixed mx-auto h-fit inset-0 top-0 z-30",
        scrolled ? "w-full bg-white shadow-md" : "max-w-6xl w-full",
      )}
    >
      <div
        // className="h-20 max-w-7xl mx-auto px-6 flex items-center justify-between"
        className={cn(
          "h-16 max-w-6xl mx-auto px-6 flex items-center justify-between",
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
                  "capitalize font-medium transition-colors duration-300 ease-in-out",
                  isActive
                    ? " text-violet-900 "
                    : "text-neutral-500 hover:text-neutral-900",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
          {user ? (
            <>
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-fuchsia-500 text-[10px] font-bold text-white">
                {getInitials(user.name)}
              </div>
              <button
                onClick={handleLogout}
                className=" border border-red-500 backdrop-blur-2xl text-red-500 shadow-sm transition-colors hover:bg-red-500/20 hover:cursor-pointer  px-4 py-1.5 flex items-center gap-2 rounded-md"
              >
                <p>Signout</p>
                <LogOutIcon size={14} />{" "}
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="login"
                className="capitalize font-medium text-neutral-500 hover:text-neutral-900"
              >
                Signin
              </NavLink>
              <NavLink
                to="/register"
                className="bg-chart-1 drop-shadow-sm px-4 py-1.5 flex items-center gap-2 rounded-full"
              >
                <p>Get Started</p>
                <ArrowRight />{" "}
              </NavLink>
            </>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen((pre) => !pre)}
        >
          {isMenuOpen ? (
            <X className="text-neutral-900" />
          ) : (
            <MenuIcon className="text-neutral-900" />
          )}
        </button>
      </div>
      <div
        className={cn(
          "absolute inset-x-0 flex flex-col md:hidden gap-6 py-6 items-center bg-linear-to-b from-violet-200 to-fuchsia-200 border-b border-t border-white/60 transition-transform origin-top ease-in-out duration-500",
          isMenuOpen
            ? "scale-y-100 opacity-100 visible"
            : "scale-y-0 opacity-0 invisible",
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
        {user ? (
          <>
            <p className="font-semibold truncate text-fuchsia-700 ">
              {user.name}
            </p>
            <button
              onClick={handleLogout}
              className="font-semibold truncate text-red-700 "
            >
              Signout
            </button>
          </>
        ) : (
          <>
            <NavLink
              to="login"
              className="capitalize font-medium text-neutral-500 hover:text-neutral-900"
            >
              Signin
            </NavLink>
            <NavLink
              to="/register"
              className="bg-chart-1 drop-shadow-sm px-4 py-1.5 flex items-center gap-2 rounded-full"
            >
              <p>Get Started</p>
              <ArrowRight />{" "}
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
