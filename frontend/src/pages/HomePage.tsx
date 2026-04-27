import { useRef, useState, type ChangeEvent } from "react";
import { getAutocompleteManga, getRandomManga } from "../features/manga/api";
import type { MangaResponse } from "../features/manga/types";
import GameApi from "../features/game/api";
import type { GameResponse } from "../features/game/types";

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [manga, setManga] = useState<MangaResponse | null>(null);
  const [autocompleteResults, setAutocompleteResults] = useState<
    MangaResponse[]
  >([]);
  const [isSearchResultOpen, setIsSearchResultOpen] = useState(false);
  const [game, setGame] = useState<GameResponse | null>(null);
  const [activeType, setActiveType] = useState<"manga" | "game" | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchRandomManga = async () => {
    setActiveType("manga");
    setLoading(true);
    try {
      const response = await getRandomManga();
      setManga(response);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching manga data:", error);
      setLoading(false);
    }
  };

  const fetchAutocompleteManga = async (query: string) => {
    try {
      const response = await getAutocompleteManga(query);
      setAutocompleteResults(response);
    } catch (error) {
      console.error("Error fetching manga data:", error);
    }
  };

  const fetchRandomGame = async () => {
    setActiveType("game");
    setLoading(true);
    try {
      const response = await GameApi();
      setGame(response);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching game data:", error);
      setLoading(false);
    }
  };

  const handleReserch = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (value.length < 2) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      fetchAutocompleteManga(value);
    }, 500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Test API</h1>
      <div className="relative w-64 mb-4">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Rechercher"
          onChange={handleReserch}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          onFocus={() => setIsSearchResultOpen(true)}
          onBlur={() => setTimeout(() => setIsSearchResultOpen(false), 150)}
        />
        {isSearchResultOpen && autocompleteResults.length > 0 && (
          <ul className="absolute left-0 right-0 mt-1 bg-zinc-950 border border-gray-300 rounded-lg shadow-lg z-10">
            {autocompleteResults.map((manga) => (
              <li
                key={manga.id}
                className="px-4 py-2 hover:bg-zinc-800 cursor-pointer rounded-lg"
              >
                {manga.title}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition mr-2"
          onClick={fetchRandomManga}
        >
          Tirer un manga
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition mr-2"
          onClick={fetchRandomGame}
        >
          Tirer un jeu
        </button>
      </div>
      {activeType === "manga" && (
        <div className="text-center">
          <p className="text-lg">Manga tiré au sort :</p>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <p className="mb-4">
                Id : <strong>{manga?.id}</strong>
              </p>
              <p className="mb-4">
                Titre : <strong>{manga?.title}</strong>
              </p>
              <p className="mb-4">
                Auteur : <strong>{manga?.author}</strong>
              </p>
              <img className="m-auto" src={manga?.coverUrl} alt="Cover" />
            </>
          )}
        </div>
      )}

      {activeType === "game" && (
        <div className="text-center">
          <p className="text-lg">Jeu tiré au sort :</p>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <p className="mb-4">
                Nom : <strong>{game?.name}</strong>
              </p>
              <p className="mb-4">
                Résumé : <strong>{game?.summary}</strong>
              </p>
              <p className="mb-4">
                Note : <strong>{game?.rating}</strong>
              </p>
              <p className="mb-4">
                Couverture ID : <strong>{game?.cover?.image_id}</strong>
              </p>
              <p className="mb-4">
                Plateformes ID : {game?.platforms?.join(", ")}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
