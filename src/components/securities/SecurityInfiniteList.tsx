import { useState, useEffect, useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component"
import {Loader2} from "lucide-react";

interface SecurityItem {
  id: number;
  name: string;
  price?: string;
}

const Security = ({ security }: { security: SecurityItem }) => {
    return (
      <div className="w-full rounded-lg border-2  p-2">
        <div className="font-bold text-background-foreground">
          {security.id} - {security.name}
        </div>
        {security.price && (
          <div className="text-sm text-muted-foreground">{security.price}</div>
        )}
      </div>
    );
  };
export default function SecurityInfiniteList({ variant }: { variant: string }) {
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [securities, setSecurities] = useState<SecurityItem[]>([]);

  // Reset everything when variant changes
  useEffect(() => {
    setPage(0);
    setSecurities([]);
    setHasMore(true);
    // Trigger initial load
    next();
  }, [variant]);

  const next = async () => {
    if (loading) return;
    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const data = fetchSecurities(variant, page);
      setSecurities(prev => [...prev, ...data.items]);
      setPage(prev => prev + 1);

      if (data.items.length < 3) {
        setHasMore(false);
      }
      setLoading(false);
    }, 300);
  };

  // Mock API fetch function
  const fetchSecurities = (type: string, pageNum: number) => {
    const limit = 3;
    const skip = limit * pageNum;
    
    // Generate mock data based on variant and page
    const allItems = generateSecurities(type);
    const items = allItems.slice(skip, skip + limit);
    
    return {
      items,
      total: allItems.length,
      skip,
      limit
    };
  };

  // Generate mock securities data
  const generateSecurities = (type: string): SecurityItem[] => {
    const baseItems = getListItems(type);
    // Expand the list to 30 items for each type to enable pagination
    return Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `${baseItems[i % baseItems.length].name}${Math.floor(i / baseItems.length) + 1 > 1 ? ` (${Math.floor(i / baseItems.length) + 1})` : ''}`,
      price: `$${(Math.random() * 1000).toFixed(2)}`
    }));
  };

  // Your original getListItems function
  const getListItems = (variant: string) => {
    switch (variant) {
      case 'stocks':
        return [
          { name: 'Stock1' },
          { name: 'Stock2' },
          { name: 'Stock3' },
          { name: 'Stock1' },
          { name: 'Stock2' },
          { name: 'Stock3' },
          { name: 'Stock1' },
          { name: 'Stock2' },
          { name: 'Stock3' },
          { name: 'Stock1' },
          { name: 'Stock2' },
          { name: 'Stock3' },
          { name: 'Stock1' },
          { name: 'Stock2' },
        ];
      case 'futures':
        return [
          { name: 'Future1' },
          { name: 'Future2' },
          { name: 'Future3' },
        ];
      case 'forex':
        return [
          { name: 'Forex1' },
          { name: 'Forex2' },
          { name: 'Forex3' },
        ];
      case 'options':
        return [
          { name: 'Option1' },
          { name: 'Option2' },
          { name: 'Option3' },
        ];
      default:
        return [];
    }
  };

  return (

      <div
          id="scrollableDiv"
          className="max-h-full overflow-y-auto"
      >
        {/*Put the scroll bar always on the bottom*/}
        <InfiniteScroll
            dataLength={100}
            next={next}
            // style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
            // inverse={true} //
            hasMore={hasMore}
            loader={<div className="mx-auto w-full text-center">
              <span className="icon-[ph--circle-notch] size-8 text-foreground animate-spin" />
            </div>}
            scrollableTarget="scrollableDiv"
        >
          {securities.map((security, index) => (
              <Security  key={index} security={security} />
          ))}
        </InfiniteScroll>
      </div>

  );
}
