import { Home } from "lucide-react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 text-center p-4">
      <div className="space-y-2">
        <p className="text-8xl font-black text-white/10">404</p>
        <h1 className="text-2xl font-bold">Page Not Found</h1>
        <p className="text-sm text-muted-foreground max-w-xs">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
      <Link
        to="/dashboard"
        className="flex items-center gap-2 rounded-xl bg-linear-to-r from-violet-500 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:opacity-90 transition-opacity"
      >
        <Home className="h-4 w-4" />
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;
