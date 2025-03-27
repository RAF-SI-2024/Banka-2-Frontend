import * as React from "react";
import {Button} from "@/components/ui/button.tsx";
import SearchFilter from "@/components/__common__/SearchFilter.tsx";
import {useRef, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";

interface SecurityFilterProps{
    variant: string;
}

export default function SecurityFilters({variant}: SecurityFilterProps){
    const [searchValue, setSearchValue] = useState("");
    const [showFilters, setShowFilters] = React.useState(false);

    return (
        <div>
            <SearchFilter
                value={searchValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
                onClear={() => setSearchValue("")}
                divClassName="bg-card z-50"
            />

            <motion.div
                className="relative overflow-hidden"
                animate={{ height: showFilters ? 150 : 25 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                <AnimatePresence>
                    {showFilters && (
                        <motion.div

                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="p-4 bg-card h-100 flex flex-col items-center"

                        >
                            {/* Your filter content goes here */}
                            <div>Filter 1</div>
                            <div>Filter 2</div>
                            <div>Filter 3</div>

                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    className="w-full flex justify-around absolute bottom-0"
                    animate={{ y: showFilters ? -25 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <Button
                        variant="negative"
                        size="tight"
                        onClick={() => setShowFilters(!showFilters)}
                        className="py-0.5 z-0 text-sm w-full rounded-t-none rounded-b-4xl flex flex-row items-center justify-center gap-1"
                    >
                        <span className="size- icon-[ph--funnel-simple]" />
                        Filters
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    )
}