import { createContext, useContext, useEffect, useState } from "react";
import * as React from "react";

type DataType = string | number | boolean | object;

type DataProviderProps = {
    children: React.ReactNode;
    defaultData?: DataType;
    storageKey?: string;
};

type DataProviderState = {
    data: DataType;
    setData: (data: DataType) => void;
};

const initialState: DataProviderState = {
    data: "",
    setData: () => null,
};

const DataProviderContext = createContext<DataProviderState>(initialState);

export function DataProvider({
                                 children,
                                 defaultData = "",
                                 storageKey = "vite-ui-data",
                                 ...props
                             }: DataProviderProps) {
    const [data, setData] = useState<DataType>(
        () => JSON.parse(sessionStorage.getItem(storageKey) || JSON.stringify(defaultData))
    );

    useEffect(() => {
        // Store data in sessionStorage whenever it changes
        sessionStorage.setItem(storageKey, JSON.stringify(data));
    }, [data, storageKey]);

    const value = {
        data,
        setData: (newData: DataType) => {
            setData(newData);
        },
    };

    return (
        <DataProviderContext.Provider {...props} value={value}>
            {children}
        </DataProviderContext.Provider>
    );
}

export const useData = () => {
    const context = useContext(DataProviderContext);

    if (context === undefined)
        throw new Error("useData must be used within a DataProvider");

    return context;
};
