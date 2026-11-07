import { getUpcomingGames } from "../api";
import { useAsyncData } from "../../../shared/hooks/useAsyncData";

export const useUpcomingGames = () =>
  useAsyncData(getUpcomingGames, "Impossible de charger les prochaines sorties.");
