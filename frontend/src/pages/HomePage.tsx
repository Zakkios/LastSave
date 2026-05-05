import InfiniteScroll from "react-infinite-scroll-component";
import { MangaSearch } from "../features/manga/components/MangaSearch";
import { useState } from "react";
import type { MangaShortResponse } from "../features/manga/types";
import { getMangaByPage } from "../features/manga/api";
import { MangaPreviewCard } from "../features/manga/components/MangaPreviewCard";
import { useNavigate } from "react-router";

const HomePage = () => {
  const [page, setPage] = useState<number>(0);
  const [items, setItems] = useState<MangaShortResponse[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const fetchMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    const newItems = await getMangaByPage(page);

    setItems((prevItems) => [...prevItems, ...newItems]);
    setPage((prevPage) => prevPage + 1);

    if (newItems.length < 20) {
      setHasMore(false);
    }

    setLoading(false);
  };

  const handleClickPreviewCard = (id: string) => {
    navigate(`/manga/${id}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-10 px-4">
      <h1 className="text-4xl font-extrabold mb-8 bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
        LastSave Explorer
      </h1>

      <MangaSearch />
      <InfiniteScroll
        dataLength={items.length}
        next={fetchMore}
        hasMore={hasMore}
        loader={
          <div className="animate-pulse flex flex-col items-center space-y-4 py-4">
            <div className="h-28 w-full bg-zinc-800 rounded"></div>
          </div>
        }
        endMessage={
          <p className="text-zinc-500 text-center py-4">
            Tous les mangas sont chargés.
          </p>
        }
      >
        <div className="w-full max-w-2xl flex flex-col gap-3">
          {items.map((item) => (
            <button
              className="cursor-pointer"
              onClick={() => handleClickPreviewCard(item.id)}
              key={item.id}
            >
              <MangaPreviewCard key={item.id} manga={item} />
            </button>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default HomePage;
