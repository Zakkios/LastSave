import http from "../../services/http";
import type { LibraryStats, RecentEntry } from "./types";

// Nombre d'entrées par statut, mangas et jeux (compté en base, sans API externe).
const getLibraryStats = async (): Promise<LibraryStats> => {
  try {
    const response = await http.get<LibraryStats>("/library/stats");
    return response.data;
  } catch (error) {
    console.error("Error calling library stats API:", error);
    throw error;
  }
};

// Derniers ajouts et changements de statut, mangas et jeux mélangés.
const getRecentEntries = async (): Promise<RecentEntry[]> => {
  try {
    const response = await http.get<RecentEntry[]>("/library/recent");
    return response.data;
  } catch (error) {
    console.error("Error calling recent entries API:", error);
    throw error;
  }
};

export { getLibraryStats, getRecentEntries };
