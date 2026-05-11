import { Outlet } from "react-router";
import AppSidebar from "../components/AppSidebar";
import Topbar from "../components/Topbar";
import MobileNav from "../components/MobileNav";

const AppShell = () => {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-50">
      {/* Sidebar Desktop */}
      <AppSidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Topbar */}
        <Topbar />

        {/* Page Content */}
        <main className="flex-1 pb-20 lg:pb-8">
          <div className="container mx-auto p-4 lg:p-8">
            <Outlet />
          </div>
        </main>

        {/* Mobile Navigation */}
        <MobileNav />
      </div>
    </div>
  );
};

export default AppShell;
