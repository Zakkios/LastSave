import { getLibraryStats } from "../api";
import { useAsyncData } from "../../../shared/hooks/useAsyncData";

export const useLibraryStats = () =>
  useAsyncData(getLibraryStats, "Impossible de charger les chiffres de votre collection.");
