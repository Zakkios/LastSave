import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getMangaById } from "../features/manga/api";
import type { MangaResponse } from "../features/manga/types";

const MangaDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const [manga, setManga] = useState<MangaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Manga introuvable");
      setLoading(false);
      return;
    }

    const fetchMangaById = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getMangaById(id);
        setManga(response);
      } catch (error) {
        console.error("Error fetching manga data:", error);
        setError("Impossible de charger le manga");
      } finally {
        setLoading(false);
      }
    };

    fetchMangaById();
  }, [id]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;
  if (!manga) return <div>Manga introuvable</div>;

  return (
    <div>
      <h1>{manga.title}</h1>

      {manga.author && <p>Author: {manga.author}</p>}

      {manga.coverUrl && <img src={manga.coverUrl} alt={manga.title} />}
    </div>
  );
};

export default MangaDetailPage;
