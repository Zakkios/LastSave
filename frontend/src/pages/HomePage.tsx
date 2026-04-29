import { useState } from "react";
import { useManga } from "../features/manga/hooks/useManga";
import { useGame } from "../features/game/hooks/useGame";
import { MangaCard } from "../features/manga/components/MangaCard";
import { MangaSearch } from "../features/manga/components/MangaSearch";
import { GameCard } from "../features/game/components/GameCard";

const HomePage = () => {
  const [activeType, setActiveType] = useState<"manga" | "game" | null>(null);
  
  const { 
    manga, 
    loading: loadingManga, 
    fetchRandomManga 
  } = useManga();
  
  const { 
    game, 
    loading: loadingGame, 
    fetchRandomGame 
  } = useGame();

  const handleFetchManga = () => {
    setActiveType("manga");
    void fetchRandomManga();
  };

  const handleFetchGame = () => {
    setActiveType("game");
    void fetchRandomGame();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-10 px-4">
      <h1 className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
        LastSave Explorer
      </h1>

      <MangaSearch />

      <div className="flex gap-4 mb-10">
        <button
          className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-all shadow-lg shadow-blue-900/20 active:scale-95"
          onClick={handleFetchManga}
        >
          Tirer un manga
        </button>
        <button
          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
          onClick={handleFetchGame}
        >
          Tirer un jeu
        </button>
      </div>

      <div className="w-full max-w-lg">
        {activeType === "manga" && (
          <div className="space-y-4">
            <h2 className="text-center text-zinc-500 uppercase tracking-widest text-sm font-bold">Manga tiré au sort</h2>
            {loadingManga ? (
              <div className="animate-pulse flex flex-col items-center space-y-4">
                <div className="h-8 w-48 bg-zinc-800 rounded"></div>
                <div className="h-64 w-full bg-zinc-800 rounded"></div>
              </div>
            ) : manga && (
              <MangaCard manga={manga} />
            )}
          </div>
        )}

        {activeType === "game" && (
          <div className="space-y-4">
            <h2 className="text-center text-zinc-500 uppercase tracking-widest text-sm font-bold">Jeu tiré au sort</h2>
            {loadingGame ? (
              <div className="animate-pulse flex flex-col items-center space-y-4">
                <div className="h-8 w-48 bg-zinc-800 rounded"></div>
                <div className="h-48 w-full bg-zinc-800 rounded"></div>
              </div>
            ) : game && (
              <GameCard game={game} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
