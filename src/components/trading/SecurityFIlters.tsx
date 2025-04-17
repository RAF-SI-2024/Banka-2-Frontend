import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import SearchFilter from "@/components/__common__/SearchFilter.tsx";
import {AnimatePresence, motion} from "framer-motion";
import {Label} from "@/components/ui/label.tsx";
import {DatePickerWithRange} from "@/components/ui/date-range-picker.tsx";
import {DateRange} from "react-day-picker";
import {Input} from "@/components/ui/input.tsx";
import {DualRangeSlider} from "@/components/ui/dual-range-slider.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu.tsx";
import {DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import {SecurityType} from "@/types/exchange/security.ts";

interface SecurityFilterProps{
    type: SecurityType;
    doFetch:() => void;
}

export default function SecurityFilters({type, doFetch}: SecurityFilterProps){
    const [searchValue, setSearchValue] = useState("");
    const [showFilters, setShowFilters] = React.useState(false);
    const [askValues, setAskValues] = useState([0, 1000000]);
    const [bidValues, setBidValues] = useState([0, 1000000]);
    const [amountValues, setAmountValues] = useState([0, 1000000]);
    const [sorting, setSorting] = useState<string>("");

    const filterRef = useRef<HTMLDivElement>(null);  // To track the filter dialog

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setShowFilters(false);  // Close dialog when click happens outside
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside); // Cleanup listener
        };
    }, []);


    const [filters, setFilters] = useState({
        fromDate: undefined as Date | undefined,
        toDate: undefined as Date | undefined,
        status: "",
    });

    const handleClear = async () => {
        console.log("Filters cleared...");
        setFilters({
            fromDate: undefined,
            toDate: undefined,
            status: "",
        });
        setShowFilters(false);
        doFetch();
    };

    const handleApply = () => {
        console.log(filters);
        setShowFilters(false);
        doFetch();
    }

    const handleSearch = () => {
        console.log(searchValue);
        setShowFilters(false);
        doFetch();
    }

    const handleSearchClear = () => {
        console.log("Search clear...");
        setSearchValue("");
        setShowFilters(false);
        doFetch();
    }

    const handleSort = (value: string) => {
        console.log(value);
        setSorting(value);
        setShowFilters(false);
        doFetch();
    }

    return (
        <div className="relative">
            <div className="w-full flex flex-row gap-1 ">
                <SearchFilter
                    value={searchValue}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
                    onClear={handleSearchClear}
                    divClassName="bg-card z-50"
                />
                <Button size="icon" variant="outline" onClick={handleSearch}>
                    <span className="icon-[ph--magnifying-glass]" />
                </Button>
                <DropdownMenu onOpenChange={() => setShowFilters(false)}>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="z-0 ml-auto  size-9 lg:flex"

                        >
                            <span className="icon-[ph--sort-ascending]" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[180px] pl-0" >

                        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuRadioGroup value={sorting} onValueChange={handleSort}>
                            <DropdownMenuRadioItem value="">Default</DropdownMenuRadioItem>
                            <DropdownMenuSeparator className="bg-muted"/>
                            <DropdownMenuRadioItem value="1">Price Increasing</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="2">Price Decreasing</DropdownMenuRadioItem>
                            <DropdownMenuSeparator className="bg-muted"/>
                            <DropdownMenuRadioItem value="3">Amount Increasing</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="4">Amount Decreasing</DropdownMenuRadioItem>
                            <DropdownMenuSeparator className="bg-muted"/>
                            <DropdownMenuRadioItem value="5">Maintenance margin Increasing</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="6">Maintenance margin Decreasing</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Filters toggle button */}
            <div className="w-full flex justify-around mt-1">
                <Button
                    variant="negative"
                    size="tight"
                    onClick={() => {!showFilters && setShowFilters(true)}}
                    className="py-0.5 pt-0 -mt-[4px] mx-1 z-0 text-sm w-full rounded-t-none rounded-b-4xl flex flex-row items-center"
                >
                    <span className="icon-[ph--funnel-simple]" /> Filters
                </Button>
            </div>

            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        className="fixed inset-0 bg-black/30 z-[99]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setShowFilters(false)}
                    />
                )}
            </AnimatePresence>

            {/* Filters overlay content */}
            <AnimatePresence>
                {showFilters && (

                    <motion.div
                        initial={{ opacity: 0, y: 0, x:20}}
                        animate={{ opacity: 1, y: 0, x:0 }}
                        exit={{ opacity: 0, y: -30, x: 20 }}
                        className="md:w-100 w-full absolute top-full right-0 bg-card z-[100] p-4 shadow-xl shadow-shadow rounded-xl"
                        ref={filterRef}
                    >
                        {(type === SecurityType.Future || type === SecurityType.Option) && (
                            <div className="w-full mb-4">
                                <Label>Settlement date</Label>
                                <DatePickerWithRange
                                    className="max-w-full"
                                    date={{ from: filters.fromDate, to: filters.toDate }}
                                    setDate={(range) => {
                                        if (range) {
                                            const rangeDate = range as DateRange;
                                            setFilters(prev => ({
                                                ...prev,
                                                fromDate: rangeDate?.from,
                                                toDate: rangeDate?.to,
                                            }));
                                        }
                                    }}
                                />
                            </div>
                        )}

                        <div className="space-y-6">
                            <div className="w-full">
                                <Label>Exchange acronym</Label>
                                <Input placeholder="NASDAQ" />
                            </div>

                            <RangeSection
                                label="Ask price (RSD)"
                                values={askValues}
                                onChange={setAskValues}
                            />

                            <RangeSection
                                label="Bid price (RSD)"
                                values={bidValues}
                                onChange={setBidValues}
                            />

                            <RangeSection
                                label="Amount"
                                values={amountValues}
                                onChange={setAmountValues}
                            />

                            <div className="flex flex-col gap-0">
                                <Button variant="negative" className="text-destructive w-full flex flex-row items-baseline" onClick={handleClear}>
                                    <span className="icon-[ph--funnel-simple-x]" /> Clear filters
                                </Button>
                                <Button variant="gradient" className="w-full flex flex-row items-baseline [-0" onClick={handleApply}>
                                    <span className="icon-[ph--funnel-simple]" /> Apply filters
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function RangeSection({ label, values, onChange }: {
    label: string;
    values: number[];
    onChange: (values: number[]) => void;
}) {
    return (
        <div className="w-full flex flex-col gap-2">
            <Label>{label}</Label>
            <DualRangeSlider
                className="pt-2"
                value={values}
                onValueChange={onChange}
                min={0}
                max={1000000}
                step={1}
            />
            <div className="w-full flex flex-row justify-between lg:gap-24 md:gap-0 sm:gap-8">
                <Input
                    type="number"
                    min={0}
                    max={1000000}
                    value={values[0]}
                    onChange={(e) => onChange([e.target.valueAsNumber, values[1]])}
                />
                <Input
                    type="number"
                    min={0}
                    max={1000000}
                    value={values[1]}
                    onChange={(e) => onChange([values[0], e.target.valueAsNumber])}
                />
            </div>
        </div>
    );
}