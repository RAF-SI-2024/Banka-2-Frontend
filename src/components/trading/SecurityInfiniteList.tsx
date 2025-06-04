import {useEffect, useRef, useState} from "react";
import InfiniteScroll from "react-infinite-scroll-component"
import {getSecurityTypePlural, Security, SecuritySimple, SecurityType} from "@/types/exchange/security.ts";
import SecurityListSingle from "@/components/trading/SecurityListSingle.tsx";
import {generateSecurities} from "@/__mocks/trading/SecurityListMock.ts";
import {getAllSecuritiesOfType} from "@/api/exchange/security.ts";
import {showErrorToast} from "@/lib/show-toast-utils.tsx";

interface InfiniteListProps {
    type: SecurityType;
    scrollableId: string;
    itemsPerPage?: number;
    fetchFlag: boolean;
}

export default function SecurityInfiniteList({ type, scrollableId, fetchFlag, itemsPerPage = 20 }: InfiniteListProps) {
    const [page, setPage] = useState(1);
    const initialized = useRef(false)
    const [hasMore, setHasMore] = useState(true);
    const [securities, setSecurities] = useState<SecuritySimple[]>([]);

    // Reset when dependencies change
    useEffect(() => {
        setPage(1);
        setSecurities([]);

        next(1);
    }, [type, fetchFlag]); // Include itemsPerPage in dependencies

    const next = async (currentPage: number = page) => {
        try {
            let newSecurities: SecuritySimple[] = [];
            if (type == SecurityType.Stock) { // TODO: izbrisati kad se dodaju rute za svaki tip
                newSecurities = (await getAllSecuritiesOfType(type, currentPage, itemsPerPage)).items;
                console.log(newSecurities[0]);
            } else {
                newSecurities = await generateSecurities(type, currentPage, itemsPerPage);
            }

            if (page == 1)
                setSecurities(newSecurities);
            else
                setSecurities(prev => [...prev, ...newSecurities]);

            setPage(currentPage + 1);
            setHasMore(newSecurities.length >= itemsPerPage);

            initialized.current = false;
        }
        catch (error) {
            showErrorToast({error, defaultMessage: "Error while fetching " + getSecurityTypePlural(type) + "."} );
        }

    };

    return (
        <InfiniteScroll
            className="overflow-y-hidden"
            dataLength={securities.length}
            next={next}
            hasMore={hasMore}
            loader={
                <div className="mx-auto w-full text-center size-16 mt-4">
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
                <SecurityListSingle key={security.id} security={security} securityType={type} />
            ))}
        </InfiniteScroll>
    );
}