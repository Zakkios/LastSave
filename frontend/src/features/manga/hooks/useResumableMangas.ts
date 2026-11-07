import { getResumableMangas } from "../api";
import { useAsyncData } from "../../../shared/hooks/useAsyncData";

// Mangas « Terminé » qui ont reçu un nouveau chapitre en français : à remettre en cours ?
export const useResumableMangas = () =>
  useAsyncData(getResumableMangas, "Impossible de vérifier les nouveaux chapitres.");
