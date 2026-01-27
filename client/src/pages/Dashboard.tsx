import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logoutUser } from "../features/auth/authThunks";

const Dashboard = () => {
  const { user } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="max-w-lg w-11/12 md:w-full p-6 md:p-10 border border-gray-400 bg-white/10 flex gap-6 flex-col items-center justify-center">
        <h2 className="text-2xl">Dashboard</h2>
        <p>
          Welcome, <strong className="capitalize">{user?.name}</strong>
        </p>
        <p>
          Email:<strong className="capitalize">{user?.email}</strong>
        </p>
        <p>
          Role:<strong className="capitalize">{user?.role}</strong>
        </p>
        <Button onClick={() => dispatch(logoutUser())} className="w-full py-2 rounded bg-white/10 mt-6 border border-white/20 hover:bg-white hover:text-black hover:cursor-pointer">
            Logout
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
