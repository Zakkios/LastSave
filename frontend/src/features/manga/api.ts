import http from "../../services/http";
import type { MangaResponse } from "./types";

const MangaApi = async (): Promise<MangaResponse> => {
  try {
    const response = await http.get("/manga/random");
    return response.data;
  } catch (error) {
    console.error("Error calling manga API:", error);
    throw error;
  }
};

export default MangaApi;
