import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import FullPageLoader from "@/components/shared/FullPageLoader";

/**
 * ProtectedRoute — layout-style guard for all authenticated routes.
 *
 * Usage in router:
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/dashboard" element={<DashboardPage />} />
 *   </Route>
 *
 * - Shows FullPageLoader while initAuth() is running
 * - Redirects to /login if not authenticated
 * - Renders <Outlet /> (child routes) when authenticated
 */
const ProtectedRoute = () => {
  const { user, loading } = useAppSelector((s) => s.auth);

  if (loading) return <FullPageLoader />;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
