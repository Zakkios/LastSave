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
import useLogout from "../../features/auth/hooks/useLogout";

const navigation = [
  { name: "Accueil", href: "/dashboard", icon: LayoutDashboard },
  { name: "Mangas", href: "/mangas", icon: Library },
  { name: "Jeux", href: "/games", icon: Gamepad2 },
  { name: "Recherche", href: "/search", icon: Search },
  { name: "Profil", href: "/profile", icon: User },
];

const AppSidebar = () => {
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
        {/* Comme les liens du menu, mais rose au survol : on quitte l'appli. */}
        <button
          type="button"
          className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
          onClick={logout}
        >
          <LogOut className="h-5 w-5" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
