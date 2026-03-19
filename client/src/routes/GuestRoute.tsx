import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

/**
 * GuestRoute — layout-style guard for public-only pages (Login, Register).
 *
 * Usage in router:
 *   <Route element={<GuestRoute />}>
 *     <Route path="/login" element={<Login />} />
 *   </Route>
 *
 * - Returns null while initAuth() is running (no flicker)
 * - Redirects to /dashboard if already authenticated
 * - Renders <Outlet /> (child routes) for unauthenticated users
 */
const GuestRoute = () => {
  const { user, loading } = useAppSelector((s) => s.auth);

  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
};

export default GuestRoute;
