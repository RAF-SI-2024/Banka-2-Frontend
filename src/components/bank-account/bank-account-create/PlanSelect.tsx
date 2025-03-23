// PlanSelect.tsx
//import React from "react";
//import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"; // Prilagodi import prema tvojoj strukturi

import { Label } from "@/components/ui/label.tsx"; // Ako koristiš Label komponentu iz svog UI paketa
// interface PlanSelectProps {
//     plan: string;
//     handlePlanChange: (value: string) => void;
//     ownership: string;
//     accountTypes: any[];
// }
//
// const PlanSelect: React.FC<PlanSelectProps> = ({ plan, handlePlanChange, ownership, accountTypes }) => {
//     return (
//         <div className="w-full">
//             <Select value={plan} onValueChange={handlePlanChange}>
//                 <SelectTrigger className="w-full p-3 bg-[var(--card)] text-white border border-[var(--border)] rounded-lg">
//                     <SelectValue placeholder="Izaberi plan" />
//                 </SelectTrigger>
//                 <SelectContent>
//                     {ownership === "Business" ? (
//                         <>
//                             <SelectItem value="DOO">DOO</SelectItem>
//                             <SelectItem value="AD">AD</SelectItem>
//                             <SelectItem value="Fondacija">Fondation</SelectItem>
//                         </>
//                     ) : (
//                         <>
//                             <SelectItem value="Standard">Standard</SelectItem>
//                             <SelectItem value="Premium">Premium</SelectItem>
//                             <SelectItem value="Pensioners">Pensioners</SelectItem>
//                             <SelectItem value="Youth">Youth</SelectItem>
//                             <SelectItem value="Student">Student</SelectItem>
//                             <SelectItem value="Unemployed">Unemployed</SelectItem>
//                         </>
//                     )}
//                 </SelectContent>
//             </Select>
//         </div>
//     );
// };
//
// export default PlanSelect;





// import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select.tsx";
//
// interface PlanSelectProps {
//     plan: string;
//     handlePlanChange: (value: string) => void;
//     ownership: string;
//     accountTypes: any[];
//     setSelectedPlanId
// }
//
// const PlanSelect: React.FC<PlanSelectProps> = ({ plan, handlePlanChange, ownership, accountTypes, setSelectedPlanId }) => {
//     // Filtriraj accountTypes u zavisnosti od ownership-a
//     const filteredAccountTypes = accountTypes.filter(accountType => {
//         if (ownership === "Business") {
//             // Filtriraj accountTypes sa kodovima između 21 i 29
//             const code = parseInt(accountType.code);
//             return code >= 21 && code <= 29;
//         } else if (ownership === "Personal") {
//             // Filtriraj accountTypes sa kodovima između 11 i 19
//             const code = parseInt(accountType.code);
//             return code >= 11 && code <= 19;
//         }
//         return false;
//     });
//
//     return (
//         <div className="w-full">
//             <Select value={plan} onValueChange={handlePlanChange}>
//                 <SelectTrigger className="w-full p-3 bg-[var(--card)] text-white border border-[var(--border)] rounded-lg">
//                     <SelectValue placeholder="Izaberi plan" />
//                 </SelectTrigger>
//                 <SelectContent>
//                     {filteredAccountTypes.map((accountType) => (
//                         <SelectItem key={accountType.id} value={accountType.name}>
//                             {accountType.name}
//                         </SelectItem>
//                     ))}
//                 </SelectContent>
//             </Select>
//         </div>
//     );
// };
//
// export default PlanSelect;


// import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select.tsx";
//
// interface PlanSelectProps {
//     plan: string;
//     handlePlanChange: (value: string) => void;
//     ownership: string;
//     accountTypes: any[];
//     setSelectedPlanId: (id: string) => void; // Funkcija koja postavlja id izabranog plana
// }
//
// const PlanSelect: React.FC<PlanSelectProps> = ({ plan, handlePlanChange, ownership, accountTypes, setSelectedPlanId }) => {
//     // Filtriraj accountTypes u zavisnosti od ownership-a
//     const filteredAccountTypes = accountTypes.filter(accountType => {
//         if (ownership === "Business") {
//             // Filtriraj accountTypes sa kodovima između 21 i 29
//             const code = parseInt(accountType.code);
//             return code >= 21 && code <= 29;
//         } else if (ownership === "Personal") {
//             // Filtriraj accountTypes sa kodovima između 11 i 19
//             const code = parseInt(accountType.code);
//             return code >= 11 && code <= 19;
//         }
//         return false;
//     });
//
//     return (
//         <div className="w-full">
//             <Select value={plan} onValueChange={(selectedValue) => {
//                 handlePlanChange(selectedValue);  // Pozivamo originalnu funkciju za promenu plana
//                 // Postavljamo ID izabranog plana koristeći setSelectedPlanId
//                 const selectedPlan = filteredAccountTypes.find(accountType => accountType.name === selectedValue);
//                 if (selectedPlan) {
//                     setSelectedPlanId(selectedPlan.id);  // Pozivamo funkciju sa ID-jem izabranog plana
//                 }
//             }}>
//                 <SelectTrigger className="w-full p-3 bg-[var(--card)] text-white border border-[var(--border)] rounded-lg">
//                     <SelectValue placeholder="Izaberi plan" />
//                 </SelectTrigger>
//                 <SelectContent>
//                     {filteredAccountTypes.map((accountType) => (
//                         <SelectItem key={accountType.id} value={accountType.name}>
//                             {accountType.name}
//                         </SelectItem>
//                     ))}
//                 </SelectContent>
//             </Select>
//         </div>
//     );
// };
//
// export default PlanSelect;

import { useEffect, useState } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select.tsx";

interface PlanSelectProps {
    plan: string;
    handlePlanChange: (value: string) => void;
    ownership: string;
    accountTypes: any[];
    setSelectedPlanId: (id: string) => void;
}

const PlanSelect: React.FC<PlanSelectProps> = ({ plan, handlePlanChange, ownership, accountTypes, setSelectedPlanId }) => {
    const [defaultPlan, setDefaultPlan] = useState<string>(plan);

    // Filtriraj accountTypes u zavisnosti od ownership-a
    const filteredAccountTypes = accountTypes.filter(accountType => {
        if (ownership === "Business") {
            const code = parseInt(accountType.code);
            return code >= 21 && code <= 29;
        } else if (ownership === "Personal") {
            const code = parseInt(accountType.code);
            return code >= 11 && code <= 19;
        }
        return false;
    });

    // Postavi plan koji već postoji u listi, ako je validan
    useEffect(() => {
        if (filteredAccountTypes.length > 0) {
            const existingPlan = filteredAccountTypes.find(accountType => accountType.name === plan);
            if (existingPlan) {
                setDefaultPlan(existingPlan.name);
                setSelectedPlanId(existingPlan.id);
            } else {
                // Ako trenutni plan nije validan, postavi prvi dostupan
                const firstPlan = filteredAccountTypes[0];
                setDefaultPlan(firstPlan.name);
                handlePlanChange(firstPlan.name);
                setSelectedPlanId(firstPlan.id);
            }
        }
    }, [filteredAccountTypes, plan, handlePlanChange, setSelectedPlanId]);

    return (
        <div className="w-full">
            <Select value={defaultPlan} onValueChange={(selectedValue) => {
                setDefaultPlan(selectedValue);
                handlePlanChange(selectedValue);
                const selectedPlan = filteredAccountTypes.find(accountType => accountType.name === selectedValue);
                if (selectedPlan) {
                    setSelectedPlanId(selectedPlan.id);
                }
            }}>
                <SelectTrigger data-cy="plan-select" className="w-full p-3 bg-[var(--card)] text-white border border-[var(--border)] rounded-lg">
                    <SelectValue>{defaultPlan || "Izaberi plan"}</SelectValue>
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

export default PlanSelect;


