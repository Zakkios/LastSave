import { getRecentEntries } from "../api";
import { useAsyncData } from "../../../shared/hooks/useAsyncData";

export const useRecentEntries = () =>
  useAsyncData(getRecentEntries, "Impossible de charger vos dernières modifications.");
