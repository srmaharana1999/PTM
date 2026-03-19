import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface IQuickActionCard {
  icon: React.ElementType;
  redirectLink: string;
  title: string;
  shortDescription: string;
}

const QuickActionCard = ({
  icon: Icon,
  redirectLink,
  title,
  shortDescription,
}: IQuickActionCard) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(redirectLink)}
      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 hover:border-violet-500/30 hover:bg-white/8 transition-all group text-left"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-violet-500/20 to-fuchsia-500/10 border border-violet-500/20 group-hover:border-violet-500/40 transition-colors">
        <Icon className="h-5 w-5 text-violet-400" />
      </div>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">{shortDescription}</p>
      </div>
      <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground/40 group-hover:text-violet-400 transition-colors" />
    </button>
  );
};

export default QuickActionCard;
