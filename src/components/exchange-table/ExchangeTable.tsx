import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { DataTable } from "@/components/__common__/datatable/DataTable.tsx";
import { getCoreRowModel } from "@tanstack/react-table";
import { DataTablePagination } from "@/components/__common__/datatable/DataTablePagination.tsx";
import { DataTableViewOptions } from "@/components/__common__/datatable/DataTableViewOptions.tsx";
import {
    getPaginationRowModel,
    SortingState,
    getSortedRowModel,
    VisibilityState,
    ColumnFiltersState,
    getFilteredRowModel,
    useReactTable
} from "@tanstack/react-table";
import { generateExchangesColumns } from "./ExchangesListColumnsDef";
import { ExchangeTableData, ExchangeTableDataResponse } from "@/types/exchange";
import { mokDataExchanges, mokCountries } from "../../mocks/mokdatasExchange";
import { getAllExchangeCountries, getAllExchanges } from "@/api/exchange";
import WorkingHoursConfirmationDialog from "../__common__/ConfirmationDialog";
import ConfirmationDialog from "../__common__/ConfirmationDialog";
import { disable, disableDescription, enable, enableDescription } from "./ConfirmationText";
import { h } from "node_modules/framer-motion/dist/types.d-B50aGbjN";


export default function ExchangeTable() {
    /* STATES */
    const [filter, setFilter] = useState({
        search: "",
        country: "",
    });

    // search active - to display clear button
    const isSearchActive = Object.values(filter).some(value => value !== "");

    // open/close dialog for delete confirmation
    const [wokingHoursComfrimation, setWokingHoursComfrimation] = useState(false);

    // Clear/Filter button clicked
    const [fetchFlag, setFetchFlag] = useState(false);

    // current exchange list
    const [exchanges, setExchangeTableData] = useState<ExchangeTableData[]>([]);

    // countries list
    const [countries, setExchangesCountries] = useState<string[]>([]);

    // working hours
    const [workingHours, setWorkingHours] = useState(false);

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    // error
    const [error, setError] = useState<string | null>(null);

    // sorting state
    const [sorting, setSorting] = useState<SortingState>([]);

    // visibility state - make some columns invisible by default
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        name: true,
        acronym: true,
        micCode: true,
        country: true,
        currency: true,
        timeZone: true,
        openTime: true,
        closeTime: true,
    });

    // column filters
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    /* FUNCTIONS */
    // fetch Exchanges function
    const fetchExchanges = async () => {
        console.log("Fetching exchanges");
        setError(null);
        try {
            //NAMESTENO SAMO ODMARKIRATI KADA NAPRAVE BACKEND

            // const ExchangeDataResponse: ExchangeTableDataResponse = await getAllExchanges(
            //     currentPage,
            //     pageSize,
            //     filter
            // ); 
            // setExchangeTableData(ExchangeDataResponse.items);
            // setTotalPages(ExchangeDataResponse.totalPages);
            // console.log(ExchangeDataResponse)

            setExchangeTableData(mokDataExchanges);
            setTotalPages(1);

        } catch (err) {
            console.log(err);
            setError("Failed to fetch exchanges");
        }
    };

    const fetchExchangesCountries = async () => {
        console.log("Fetching Countries");
        setError(null);
        try {
            // const countries: string[] = await getAllExchangeCountries(); 
            // setExchangesCountries(countries);
            setExchangesCountries(mokCountries);
        } catch (err) {
            console.log(err);
            setError("Failed to fetch exchanges");
        }
    };


    // handle search change
    const handleSearchChange = (field: string, value: string) => {
        setFilter(prevSearch => ({ ...prevSearch, [field]: value }));
    };

    // handle filter button click
    const handleFilter = () => {
        setCurrentPage(1);
        setFetchFlag(!fetchFlag);
    };

    // handle clear button in search
    const handleClearSearch = async () => {
        console.log("Clearing search...");
        // Reset search and fetch immediately
        setFilter({
            search: "",
            country: "",
        });
        setFetchFlag(!fetchFlag);
    };

    const handleStockWorkingHoursText = () => {
        setWokingHoursComfrimation(false); 
        setTimeout(() => {
            setWorkingHours(!workingHours);
        }, 100);
        // TODO: Call the API to set working hours 
    };

    const handleWorkingHoursConfirmation = () => {
        setWokingHoursComfrimation(true);
    };

    /* TABLE */

    // generate columns
    const columns = useMemo(() => {
        // Return generated columns
        return generateExchangesColumns();
    }, []); // Empty dependency array since handleOpenEditDialog is now inside

    // create the table instance with pagination, sorting, and column visibility
    const table = useReactTable({
        data: exchanges,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnVisibility,
            columnFilters,
            pagination: {
                pageIndex: currentPage - 1,
                pageSize,
            },
        },
        onPaginationChange: (updater) => {
            if (typeof updater === "function") { // we will use this
                const newPagination = updater(table.getState().pagination);
                setCurrentPage(newPagination.pageIndex + 1);
                setPageSize(newPagination.pageSize);
            } else { // this is only to avoid error
                const newPagination = updater;
                setCurrentPage(newPagination.pageIndex + 1);
                setPageSize(newPagination.pageSize);
            }

        },
        manualPagination: true,
        pageCount: totalPages,
    });

    // fetch exchanges effect (triggered on currentpage, pagesize or search change
    useEffect(() => {
        fetchExchanges();
        fetchExchangesCountries();
    }, [currentPage, pageSize, fetchFlag]); // Add dependencies

    // display error
    if (error) return <h1 className="text-center text-2xl font-semibold text-destructive">{error}</h1>;

    return (

        <div className="p-6 space-y-4">
            <div className="w-full flex flex-row items-baseline">
                {/* 🔍 Search Filters */}
                <div className="flex flex-wrap gap-4 items-center">

                    <Input
                        placeholder="Search"
                        value={filter.search}
                        onChange={(e) => handleSearchChange("search", e.target.value)}
                        className="w-88"
                    />

                    <Select onValueChange={(value) => handleSearchChange("country", value)} value={filter.country}>
                        <SelectTrigger className="w-42">
                            <SelectValue placeholder="Country" />
                        </SelectTrigger>
                        <SelectContent>
                            {countries.map((country, index) => (
                                <SelectItem key={index + 1} value={country}>
                                    {country}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="flex items-center space-x-2">
                        <Button onClick={handleFilter} variant="primary">
                            <span className="icon-[ph--funnel]" />
                            Filter
                        </Button>
                        <Button onClick={handleClearSearch} variant="secondary" disabled={!isSearchActive}>
                            <span className="icon-[ph--funnel-x]" />
                            Clear
                        </Button>

                    </div>
                </div>
                <div className="flex ml-auto">
                    <DataTableViewOptions table={table} />
                </div>
            </div>

            {/* 📋 Exchanges Table */}
            <DataTable
                key={`${currentPage}-${pageSize}`} // Re-render on pagination changes
                table={table}
            />

            {/* Pagination Controls */}
            <DataTablePagination table={table} />

            <div className="fixed bottom-4 md:right-4 right-1/2 transform translate-x-1/2 md:translate-x-0 z-50 -mr-2 -mb-2">
                <Button
                    className="size16 rounded-4xl"
                    variant={workingHours ? "destructive" : "success"}
                    onClick={handleWorkingHoursConfirmation}
                >
                    <span
                        className={`text-lg ${workingHours
                            ? "icon-[ph--clock-countdown]"
                            : "icon-[ph--clock]"
                            }`}
                    ></span>
                    {workingHours ? "Disable exchange hours" : "Enable exchange hours"}
                </Button>
            </div>

            <ConfirmationDialog open={wokingHoursComfrimation} onClose={() => { setWokingHoursComfrimation(false); }}
                onConfirm={handleStockWorkingHoursText} title={workingHours ? disable : enable} description={workingHours ? disableDescription : enableDescription} />
        </div>
    );
}