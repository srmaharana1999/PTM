import { Link } from "react-router-dom";
import { type IconType } from "react-icons";

interface INavProps {
  href: string;
  label?: string;
  icon?:IconType
}

const NavLink = ({ href, label,icon:Icon }: INavProps) => {
  return (
    <Link to={href}>
      <div
        className={`py-2 px-5 text-sm md:text-base rounded-full bg-black drop-shadow-md drop-shadow-white/20  w-fit text-white/70 hover:bg-white hover:text-black transition-colors duration-400 ease-linear`}
      >
        {Icon && <Icon className=" text-xl md:text-2xl" />}
        {label}
      </div>
    </Link>
  );
};

export default NavLink;
