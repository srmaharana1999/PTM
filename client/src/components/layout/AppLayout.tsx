import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import AppTopBar from "./AppTopBar";

/**
 * Map route path segments → human-readable page titles shown in the TopBar.
 */
const pageTitleMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/projects": "Projects",
  "/projects/new": "New Project",
  "/profile": "My Profile",
};

function resolvePageTitle(pathname: string): string {
  // Exact match first
  if (pageTitleMap[pathname]) return pageTitleMap[pathname];
  // Project sub-pages
  if (/\/projects\/.+\/settings/.test(pathname)) return "Project Settings";
  if (/\/projects\/.+\/members/.test(pathname)) return "Project Members";
  if (/\/projects\/.+/.test(pathname)) return "Project Detail";
  return "";
}

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const pageTitle = resolvePageTitle(pathname);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ── Desktop sidebar (fixed left panel) ──────────────── */}
      <div className="hidden lg:flex lg:w-60 lg:flex-col lg:shrink-0">
        <AppSidebar />
      </div>

      {/* ── Mobile sidebar overlay ───────────────────────────── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Slide-in panel */}
          <div className="absolute inset-y-0 left-0 w-64 flex flex-col animate-in slide-in-from-left duration-300">
            <AppSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* ── Main content area ─────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppTopBar
          onMobileMenuToggle={() => setSidebarOpen((prev) => !prev)}
          pageTitle={pageTitle}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
