import { MangaSearch } from "../features/manga/components/MangaSearch";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-10 px-4">
      <h1 className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
        LastSave Explorer
      </h1>

      <MangaSearch />
    </div>
  );
};

export default HomePage;
