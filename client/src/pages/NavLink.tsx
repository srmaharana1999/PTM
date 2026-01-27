import { Link } from "react-router-dom";

interface INavProps {
  href: string;
  label: string;
  className?: string;
}

const NavLink = ({ href, label, className }: INavProps) => {
  return (
    <Link to={href}>
      <div
        className={`py-3 px-8 rounded-full w-fit text-white/70 hover:text-white ${className || "hover:bg-white/20"} transition-colors duration-400 ease-linear`}
      >
        {label}
      </div>
    </Link>
  );
};

export default NavLink;
