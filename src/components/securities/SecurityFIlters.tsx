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
    DropdownMenu, DropdownMenuCheckboxItem,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuRadioItem,
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


    const [search, setSearch] = useState({
        fromDate: undefined as Date | undefined,
        toDate: undefined as Date | undefined,
        status: "",
    });

    return (
        <div>
            <div className="w-full flex flex-row gap-1">
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

            <motion.div
                className="relative overflow-hidden"
                animate={{ height: showFilters ? (variant==="futures" || variant==="options" ? 500 : 425) : 25 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                <AnimatePresence>
                    {showFilters && (
                        <motion.div

                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="py-4 px-1 w-full bg-card h-100 flex flex-col gap-4 items-center"

                        >
                            {/* Your filter content goes here */}
                            {variant == "futures" || variant=="options" &&
                            <div className="w-full">
                                <Label >Settlement date</Label>
                                <DatePickerWithRange className="max-w-full"  date={{ from: search.fromDate, to: search.toDate }}
                                                      setDate={(range) => {
                                    if(range) {
                                        const rangeDate: DateRange = range as DateRange;
                                        setSearch(prev => ({
                                            ...prev,
                                            fromDate: rangeDate?.from,
                                            toDate: rangeDate?.to,
                                        }));
                                    }

                                }} />
                            </div>}

                            <div className="w-full">
                                <Label >Exchange</Label>
                                <Input placeholder="RSD to EUR"></Input>
                            </div>

                            <div className="w-full flex flex-col gap-2">
                                <Label >Ask price</Label>
                                <DualRangeSlider className="pt-2"
                                                 value={askValues}
                                                 onValueChange={setAskValues}
                                                 min={0} max={1000000}
                                                 step={1}/>

                                <div className="w-full flex flex-row justify-between lg:gap-32 sm:gap-8">
                                    <Input type="number" min={0} max={1000000}  value={askValues[0]}
                                           onChange={(v1) => setAskValues([v1.target.valueAsNumber, askValues[1]])}/>
                                    <Input type="number" min={0} max={1000000} value={askValues[1]}
                                           onChange={(v2) => setAskValues([askValues[0], v2.target.valueAsNumber])}/>
                                </div>
                            </div>

                            <div className="w-full flex flex-col gap-2">
                                <Label >Bid price</Label>
                                <DualRangeSlider className="pt-2"
                                                 value={bidValues}
                                                 onValueChange={setBidValues}
                                                 min={0} max={1000000}
                                                 step={1}/>

                                <div className="w-full flex flex-row justify-between lg:gap-32 sm:gap-8">
                                    <Input type="number" min={0} max={1000000}  value={bidValues[0]}
                                           onChange={(v1) => setBidValues([v1.target.valueAsNumber, bidValues[1]])}/>
                                    <Input type="number" min={0} max={1000000} value={bidValues[1]}
                                           onChange={(v2) => setBidValues([bidValues[0], v2.target.valueAsNumber])}/>
                                </div>
                            </div>

                            <div className="w-full flex flex-col gap-2">
                                <Label >Amount</Label>
                                <DualRangeSlider className="pt-2"

                                                 value={amountValues}
                                                 onValueChange={setAmountValues}
                                                 min={0} max={1000000}
                                                 step={1}/>

                                <div className="w-full flex flex-row justify-between lg:gap-32 sm:gap-8">
                                    <Input type="number" min={0} max={1000000}  value={amountValues[0]}
                                           onChange={(v1) => setAmountValues([v1.target.valueAsNumber, amountValues[1]])}/>
                                    <Input type="number" min={0} max={1000000} value={amountValues[1]}
                                           onChange={(v) => setAmountValues([amountValues[0], v.target.valueAsNumber])}/>
                                </div>
                            </div>

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