import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Security, SecurityType } from "@/types/security.ts";
import SecurityListSingle from "@/components/trading/SecurityListSingle.tsx";
import { generateSecurities } from "@/mocks/trading/SecurityListMock.tsx";

interface InfiniteListProps {
  type: SecurityType;
  scrollableId: string;
  itemsPerPage?: number;
  fetchFlag: boolean;
}

export default function SecurityInfiniteList({
                                               type,
                                               scrollableId,
                                               fetchFlag,
                                               itemsPerPage = 20,
                                             }: InfiniteListProps) {
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [securities, setSecurities] = useState<Security[]>([]);

  // Reset everything when variant changes
  useEffect(() => {
    setPage(0);
    setSecurities([]);
    setHasMore(true);
  }, [type, fetchFlag]); // Removed the explicit next(0) call here

  const next = async (currentPage: number = page) => {
    if (loading) return;
    setLoading(true);

    const newSecurities = await generateSecurities(type, currentPage, itemsPerPage);

    setSecurities((prev) => [...prev, ...newSecurities]);
    setPage(currentPage + 1);
    setHasMore(newSecurities.length >= itemsPerPage); // Corrected hasMore logic

    setLoading(false);
  };

  return (
      <InfiniteScroll
          dataLength={securities.length}
          next={next}
          hasMore={hasMore}
          loader={
            <div className="mx-auto w-full text-center">
              <span className="icon-[ph--circle-notch] size-8 text-foreground animate-spin" />
            </div>
          }
          endMessage={
            <p className="text-center font-paragraph text-sm text-muted-foreground pt-2">
              Yay! You have seen it all
            </p>
          }
          scrollableTarget={scrollableId}
      >
        {securities.map((security, index) => (
            <SecurityListSingle key={index} security={security} />
        ))}
      </InfiniteScroll>
  );
}