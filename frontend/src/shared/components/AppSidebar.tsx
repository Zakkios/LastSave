import { NavLink } from "react-router";
import {
  LayoutDashboard,
  Library,
  Gamepad2,
  Search,
  User,
  LogOut,
  Gamepad,
} from "lucide-react";
import { useAuth } from "../../features/auth/hooks/useAuth";
import useLogout from "../../features/auth/hooks/useLogout";
import Button from "./Button/Button";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Mangas", href: "/mangas", icon: Library },
  { name: "Jeux", href: "/games", icon: Gamepad2 },
  { name: "Recherche", href: "/search", icon: Search },
  { name: "Profil", href: "/profile", icon: User },
];

const AppSidebar = () => {
  const { user } = useAuth();
  const { logout } = useLogout();

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-zinc-800 bg-zinc-950 lg:flex">
      <div className="flex h-16 items-center border-b border-zinc-800 px-6">
        <NavLink
          to="/"
          className="flex items-center gap-2 font-bold text-zinc-50"
        >
          <Gamepad className="h-6 w-6 text-indigo-500" />
          <span className="text-xl">LastSave</span>
        </NavLink>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-zinc-800 text-zinc-50"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-50"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-zinc-800 p-4">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
            {user?.username?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-zinc-50">
              {user?.username || "Utilisateur"}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="justify-start mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-red-400"
          onClick={logout}
        >
          <LogOut className="h-5 w-5" />
          Déconnexion
        </Button>
      </div>
    </aside>
  );
};

export default AppSidebar;
