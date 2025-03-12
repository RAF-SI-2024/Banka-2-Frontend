//import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select.tsx";
//import { Label } from "@/components/ui/label.tsx";
//import {useEffect} from "react";


// interface TypeSelectProps {
//     type: string;
//     setType: (value: string) => void;
//     accountTypes: any[];
// }
//
// const TypeSelect = ({ type, setType, accountTypes }: TypeSelectProps) => {
//
//
//     useEffect(() => {
//         console.log("ACCOUNTYPES:", accountTypes);
//     }, []);  // us
//
//     return (
//         <div className="flex flex-col space-y-1 w-full">
//             <Select value={type} onValueChange={setType}>
//                 <SelectTrigger className="w-full p-3 bg-[var(--card)] text-white border border-[var(--border)] rounded-lg">
//                     <SelectValue placeholder="Izaberi tip" />
//                 </SelectTrigger>
//                 <SelectContent>
//                     <SelectItem value="Current Account">Current Account</SelectItem>
//                     <SelectItem value="Foreign Exchange Account">Foreign Exchange Account</SelectItem>
//                 </SelectContent>
//             </Select>
//         </div>
//     );
// };

//export default TypeSelect;

import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select.tsx";
import { useEffect } from "react";

interface TypeSelectProps {
    type: string;
    setType: (value: string) => void;
    accountTypes: any[];
}

const TypeSelect = ({ type, setType, accountTypes }: TypeSelectProps) => {
    // Filtriraj accountTypes da prikaže samo "Current Account" i "Foreign Currency Account"
    const filteredAccountTypes = accountTypes.filter(accountType =>
        accountType.name === "Current Account" || accountType.name === "Foreign Currency Account"
    );

    useEffect(() => {
        console.log("Filtered Account Types:", filteredAccountTypes);
    }, [accountTypes]);  // Ovaj useEffect će se pokrenuti svaki put kada se promeni accountTypes

    return (
        <div className="flex flex-col space-y-1 w-full">
            <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-full p-3 bg-[var(--card)] text-white border border-[var(--border)] rounded-lg">
                    <SelectValue placeholder="Izaberi tip" />
                </SelectTrigger>
                <SelectContent>
                    {filteredAccountTypes.map((accountType) => (
                        <SelectItem key={accountType.id} value={accountType.name}>
                            {accountType.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default TypeSelect;









