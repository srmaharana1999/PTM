import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logoutUser } from "../features/auth/authThunks";
import NavLink from "./NavLink";

const Header = () => {
  const { user } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });
  return (
    <nav className={`border-b border-white/10 fixed inset-x-0 top-0 flex items-center p-4 transition-all duration-300 ease-in-out justify-between z-50 ${scrolled ? "bg-black/50 backdrop-blur-sm" : "bg-white/5"}`}>
      <div className="bg-linear-to-br from-violet-600 to-fuchsia-600 bg-clip-text text-2xl font-bold tracking-widest text-transparent">
        TaskMate
      </div>
      <div className="text-white flex gap-2">
        <NavLink label="Home" href="/" />
        {user ? (
          <>
            <NavLink label="Dashboard" href="/dashboard" />
            <button
              onClick={() => dispatch(logoutUser())}
              className="py-3 px-8 rounded-full w-fit text-white/70 hover:text-white hover:bg-red-400 transition-colors duration-400 ease-linear"
            >
              {" "}
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink label="Login" href="/login" />
            <NavLink label="Register" href="/register" />
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
