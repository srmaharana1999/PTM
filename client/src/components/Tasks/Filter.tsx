import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaFilter } from "react-icons/fa";

const Filter = () => {
  return (
    <Popover>
      <PopoverTrigger>
        <FaFilter className="text-white/40 shrink-0 text-3xl hover:text-white hover:cursor-pointer" />
      </PopoverTrigger>
      <PopoverContent className="w-3xs">
        <label className="text-sm">Sort Your Tasks</label>
        <Select>
          <SelectTrigger className="w-full mt-2">
            <SelectValue placeholder="Select Your Option" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="atoz">A to Z</SelectItem>
              <SelectItem value="ztoa">Z to A</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </PopoverContent>
    </Popover>
  );
};

export default Filter;
