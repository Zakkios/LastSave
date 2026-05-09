import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router";
import { MangaSearch } from "../features/manga/components/MangaSearch";
import { MangaPreviewCard } from "../features/manga/components/MangaPreviewCard";
import { useMangaInfiniteList } from "../features/manga/hooks/useMangaInfiniteList";

const HomePage = () => {
  const navigate = useNavigate();
  const { items, hasMore, error, fetchMore } = useMangaInfiniteList();

  const handleClickPreviewCard = (id: string) => {
    navigate(`/manga/${id}`);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <h1 className="mb-8 bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-4xl font-extrabold text-transparent">
        LastSave Explorer
      </h1>

      <MangaSearch />

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <InfiniteScroll
        dataLength={items.length}
        next={fetchMore}
        hasMore={hasMore}
        loader={
          <div className="w-2xl flex mt-3 gap-3 p-3 border border-zinc-800 rounded-lg bg-zinc-900/50 animate-pulse">
            <div className="w-16 h-24 shrink-0 rounded bg-zinc-800"></div>
            <div className="flex flex-col justify-center flex-1 space-y-2">
              <div className="h-4 w-3/4 bg-zinc-800 rounded"></div>
              <div className="h-3 w-1/2 bg-zinc-800 rounded"></div>
            </div>
          </div>
        }
        endMessage={
          <p className="py-4 text-center text-zinc-500">
            Tous les mangas sont chargés.
          </p>
        }
      >
        <div className="flex w-full max-w-2xl flex-col gap-3">
          {items.map((item) => (
            <button
              type="button"
              className="w-full cursor-pointer text-left"
              onClick={() => handleClickPreviewCard(item.id)}
              key={item.id}
            >
              <MangaPreviewCard manga={item} />
            </button>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default HomePage;
