import { useEffect } from "react";
import { useAppDispatch } from "./app/hooks";
import { initAuth } from "./features/auth/authThunks";
import AppRouter from "./routes/AppRouter";

function App() {
  const dispatch = useAppDispatch();

  // Restore session on every app mount by hitting /auth/refresh.
  // ProtectedRoute shows FullPageLoader while this is in flight.
  useEffect(() => {
    dispatch(initAuth());
  }, [dispatch]);

  return <AppRouter />;
}

export default App;
