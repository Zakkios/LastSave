import { useEffect, useState } from "react";
import MangaApi from "../features/manga/api";
import type { MangaResponse } from "../features/manga/types";

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [manga, setManga] = useState<MangaResponse | null>(null);

  useEffect(() => {
    const fetchMangaData = async () => {
      try {
        const response = await MangaApi();
        setManga(response);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching manga data:", error);
        setLoading(false);
      }
    };

    fetchMangaData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Test API</h1>
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
          <img src={manga?.coverUrl} alt="Cover" />
        </>
      )}
    </div>
  );
};

export default HomePage;
