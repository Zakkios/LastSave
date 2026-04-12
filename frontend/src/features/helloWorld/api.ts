import http from "../../services/http";
import type { HelloResponse } from "./types";

const HelloApi = async (): Promise<HelloResponse> => {
  try {
    const response = await http.get<HelloResponse>("/hello");
    return response.data;
  } catch (error) {
    console.error("Error calling hello API:", error);
    throw error;
  }
};

export default HelloApi;
