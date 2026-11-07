import { Link } from "react-router";
import { Gamepad } from "lucide-react";

// Barre du haut, sur mobile uniquement : sur grand écran, le menu latéral porte
// déjà le logo et chaque page affiche son propre titre (PageHeader).
const Topbar = () => {
  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center border-b border-zinc-800 bg-zinc-950/80 px-4 backdrop-blur-md lg:hidden">
      <Link to="/dashboard" className="flex items-center gap-2">
        <Gamepad className="h-6 w-6 text-indigo-500" />
        <span className="font-bold text-zinc-50">LastSave</span>
      </Link>
    </header>
  );
};

export default Topbar;
