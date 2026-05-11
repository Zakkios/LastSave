import { NavLink } from "react-router";
import { 
  LayoutDashboard, 
  Library, 
  Gamepad2, 
  Search, 
  User 
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Mangas", href: "/mangas", icon: Library },
  { name: "Jeux", href: "/games", icon: Gamepad2 },
  { name: "Recherche", href: "/search", icon: Search },
  { name: "Profil", href: "/profile", icon: User },
];

const MobileNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 flex h-16 items-center justify-around border-t border-zinc-800 bg-zinc-950/80 px-2 backdrop-blur-md lg:hidden">
      {navigation.map((item) => (
        <NavLink
          key={item.name}
          to={item.href}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 transition-colors ${
              isActive ? "text-indigo-500" : "text-zinc-500"
            }`
          }
        >
          <item.icon className="h-5 w-5" />
          <span className="text-[10px] font-medium">{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default MobileNav;
