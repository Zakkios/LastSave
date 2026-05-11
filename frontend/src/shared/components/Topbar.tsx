import { useLocation } from "react-router";
import { Gamepad, Bell } from "lucide-react";

const Topbar = () => {
  const location = useLocation();

  const getTitle = (pathname: string) => {
    switch (pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/mangas":
        return "Mes Mangas";
      case "/games":
        return "Mes Jeux";
      case "/search":
        return "Recherche";
      case "/profile":
        return "Mon Profil";
      default:
        if (pathname.startsWith("/manga/")) return "Détail Manga";
        if (pathname.startsWith("/game/")) return "Détail Jeu";
        return "LastSave";
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-zinc-800 bg-zinc-950/80 px-4 backdrop-blur-md lg:px-8">
      <div className="flex items-center gap-4">
        {/* Logo mobile uniquement */}
        <div className="flex items-center gap-2 lg:hidden">
          <Gamepad className="h-6 w-6 text-indigo-500" />
          <span className="font-bold text-zinc-50">LastSave</span>
        </div>
        
        {/* Titre desktop */}
        <h1 className="hidden text-lg font-semibold text-zinc-50 lg:block">
          {getTitle(location.pathname)}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="rounded-full p-2 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-50 transition-colors">
          <Bell className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
