import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logoutUser } from "../features/auth/authThunks";
import NavLink from "./NavLink";
import { TbHomeFilled } from "react-icons/tb";
import { LuLogOut } from "react-icons/lu";
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
    <nav className={`fixed rounded-full top-4 left-1/2 -translate-x-1/2 flex items-center py-2 p-4 border border-white/20 transition-all duration-300 ease-in-out justify-center z-50 ${scrolled ? " backdrop-blur-sm" : "bg-white/5"}`}>
      {/* <div className="bg-linear-to-br from-violet-600 to-fuchsia-600 bg-clip-text text-2xl font-bold tracking-widest text-transparent">
        TaskMate
      </div> */}
      <div className="text-white flex gap-4">
        <NavLink href="/" icon={TbHomeFilled} />
        {user ? (
          <>
            <NavLink label="Dashboard" href="/dashboard" />
            <button
              onClick={() => dispatch(logoutUser())}
              className="py-2 px-5 rounded-full bg-black drop-shadow-md drop-shadow-white/20  w-fit text-white/70 hover:bg-white hover:text-black transition-colors duration-400 ease-linear"
            >
              <LuLogOut className="text-xl"/>
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
