import { Routes, Route } from "react-router-dom";

// Guards
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

// Layout
import AppLayout from "@/components/layout/AppLayout";

// Public pages (guests only)
import Login from "@/pages/Login";
import Register from "@/pages/Register";

// Authenticated pages
import DashboardPage from "@/pages/DashboardPage";
import ProjectsListPage from "@/pages/ProjectsListPage";
import CreateProjectPage from "@/pages/CreateProjectPage";
import ProjectDetailPage from "@/pages/ProjectDetailPage";
import ProjectSettingsPage from "@/pages/ProjectSettingsPage";
import ProfilePage from "@/pages/ProfilePage";
import NotFoundPage from "@/pages/NotFoundPage";

import ProjectMembersPage from "@/pages/ProjectMembersPage";
import HomePage from "@/pages/Home";

/**
 * AppRouter — central route configuration.
 *
 * Guard Layout Pattern:
 *   <Route element={<Guard />}>        ← renders <Outlet /> or redirects
 *     <Route element={<Layout />}>     ← renders <Outlet /> inside the shell
 *       <Route path="..." element={<Page />} />
 *     </Route>
 *   </Route>
 */
const AppRouter = () => {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      {/* ── Guest-only routes ──────────────────────────────── */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* ── Authenticated routes (inside AppLayout) ────────── */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Projects */}
          <Route path="/projects" element={<ProjectsListPage />} />
          <Route path="/projects/new" element={<CreateProjectPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route
            path="/projects/:id/settings"
            element={<ProjectSettingsPage />}
          />
          <Route
            path="/projects/:id/members"
            element={<ProjectMembersPage />}
          />

          {/* Profile */}
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* ── Fallback ───────────────────────────────────────── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;
