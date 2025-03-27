import * as React from "react";
import {Button} from "@/components/ui/button.tsx";
import SearchFilter from "@/components/__common__/SearchFilter.tsx";
import {useRef, useState} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {Label} from "@/components/ui/label.tsx";
import {DatePickerWithRange} from "@/components/ui/date-range-picker.tsx";
import {DateRange} from "react-day-picker";
import {Input} from "@/components/ui/input.tsx";
import {DualRangeSlider} from "@/components/ui/dual-range-slider.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu.tsx";
import {DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";

interface SecurityFilterProps{
    variant: string;
}

export default function SecurityFilters({variant}: SecurityFilterProps){
    const [searchValue, setSearchValue] = useState("");
    const [showFilters, setShowFilters] = React.useState(false);
    const [askValues, setAskValues] = useState([0, 1000000]);
    const [bidValues, setBidValues] = useState([0, 1000000]);
    const [amountValues, setAmountValues] = useState([0, 1000000]);

    const [fetchFlag, setFetchFlag] = useState(false);

    const [search, setSearch] = useState({
        fromDate: undefined as Date | undefined,
        toDate: undefined as Date | undefined,
        status: "",
    });

    const handleClear = async () => {
        setSearch({
            fromDate: undefined,
            toDate: undefined,
            status: "",
        });
        setShowFilters(false);
        setFetchFlag(!fetchFlag);
    };

    return (
        <div className="relative">
            <div className="w-full flex flex-row gap-1 ">
                <SearchFilter
                    value={searchValue}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
                    onClear={() => setSearchValue("")}
                    divClassName="bg-card z-50"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="z-50 ml-auto  size-9 lg:flex"
                        >
                            <span className="icon-[ph--sort-ascending]" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-[180px]">
                        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Price <span className="size-4  icon-[ph--arrow-down]" /> </DropdownMenuItem>
                        <DropdownMenuItem>Price <span className="size-4  icon-[ph--arrow-up]" /> </DropdownMenuItem>
                        <DropdownMenuItem>Amount <span className="size-4  icon-[ph--arrow-down]" /> </DropdownMenuItem>
                        <DropdownMenuItem>Amount <span className="size-4 icon-[ph--arrow-up]" /> </DropdownMenuItem>
                        <DropdownMenuItem>Maintenance margin <span className="size-4  icon-[ph--arrow-down]" /> </DropdownMenuItem>
                        <DropdownMenuItem>Maintenance margin <span className="size-4  icon-[ph--arrow-up]" /> </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Filters toggle button */}
            <div className="w-full flex justify-around mt-1">
                <Button
                    variant="negative"
                    size="tight"
                    onClick={() => setShowFilters(!showFilters)}
                    className="py-0.5 z-[49] text-sm w-full rounded-t-none rounded-b-4xl flex flex-row items-center"
                >
                    <span className="icon-[ph--funnel-simple]" /> Filters
                </Button>
            </div>

            {/* Filters overlay content */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 right-0 bg-card z-0 p-4 shadow-lg shadow-black rounded-xl"
                    >
                        {(variant === "futures" || variant === "options") && (
                            <div className="w-full mb-4">
                                <Label>Settlement date</Label>
                                <DatePickerWithRange
                                    className="max-w-full"
                                    date={{ from: search.fromDate, to: search.toDate }}
                                    setDate={(range) => {
                                        if (range) {
                                            const rangeDate = range as DateRange;
                                            setSearch(prev => ({
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
                                <Label>Exchange</Label>
                                <Input placeholder="RSD to EUR" />
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

                            <Button variant="negative" className="text-destructive w-full flex flex-row items-baseline" onClick={handleClear}>
                                <span className="icon-[ph--funnel-simple-x]" /> Clear filters
                            </Button>
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