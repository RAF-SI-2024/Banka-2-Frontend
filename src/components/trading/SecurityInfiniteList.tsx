import {useState, useEffect, useRef} from "react";
import InfiniteScroll from "react-infinite-scroll-component"
import {Security, SecurityType} from "@/types/security.ts";
import SecurityListSingle from "@/components/trading/SecurityListSingle.tsx";
import {generateSecurities} from "@/mocks/trading/SecurityListMock.tsx";

interface InfiniteListProps {
    type: SecurityType;
    scrollableId: string;
    itemsPerPage?: number;
    fetchFlag: boolean;
}

export default function SecurityInfiniteList({ type, scrollableId, fetchFlag, itemsPerPage = 20 }: InfiniteListProps) {
    const [page, setPage] = useState(0);
    const initialized = useRef(false)
    const [hasMore, setHasMore] = useState(true);
    const [securities, setSecurities] = useState<Security[]>([]);

    // Reset when dependencies change
    useEffect(() => {
        setPage(0);
        setSecurities([]);

        next(0);
    }, [type, fetchFlag]); // Include itemsPerPage in dependencies

    const next = async (currentPage: number = page) => {



        const newSecurities = await generateSecurities(type, currentPage, itemsPerPage);

        if(page==0)
            setSecurities(newSecurities);
        else
            setSecurities(prev => [...prev, ...newSecurities]);

        setPage(currentPage + 1);
        setHasMore(newSecurities.length >= itemsPerPage);

        initialized.current = false;


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
            {securities.map((security) => (
                <SecurityListSingle key={security.id} security={security} />
            ))}
        </InfiniteScroll>
    );
}