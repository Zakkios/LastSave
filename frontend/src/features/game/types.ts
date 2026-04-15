export interface GameResponse {
  name: string;
  summary: string;
  platforms: number[];
  rating: number;
  cover: {
    id: number;
    image_id: string;
  };
}
