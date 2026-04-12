export const env = {
  apiBaseUrl: import.meta.env.VITE_API_URL as string,
};

if (!env.apiBaseUrl) {
  throw new Error("VITE_API_URL is not defined");
}