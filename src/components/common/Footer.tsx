import {Button} from "@/components/ui/button.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {useNavigate} from "react-router-dom";
import {Role} from "@/types/enums.ts";
import {AdminNavMainData} from "@/components/common/sidebar/nav/main/AdminNavMainData.tsx";
import {EmployeeNavMainData} from "@/components/common/sidebar/nav/main/EmployeeNavMainData.tsx";
import {ClientNavMainData} from "@/components/common/sidebar/nav/main/ClientNavMainData.tsx";
import React from "react";
import {ThemeSwitch} from "@/components/common/ThemeSwitch.tsx";
import {cn} from "@/lib/utils.ts";

// Define a type for the navigation items
interface FooterNavItem {
    title: string;
    url: string;
    items?: FooterNavItem[];
}

// Get nav data based on role
function getNavDataByRole(role: Role | null): FooterNavItem[] {
    switch (role) {
        case Role.Admin:
            return AdminNavMainData();
        case Role.Employee:
            return EmployeeNavMainData();
        case Role.Client:
            return ClientNavMainData();
        default:
            return [];
    }
}

// Generate flattened footer links, only including subitems if they exist
function generateFooterItems(): FooterNavItem[] {
    const userData = sessionStorage.getItem("user");
    const role = userData ? (JSON.parse(userData).role as Role) : null;

    const items = getNavDataByRole(role);

    // Flatten items so only subitems appear if present, otherwise include the parent
    return items.flatMap(item =>
        item.items
            ? item.items // Include subitems if present
            : [item] // Otherwise include the item itself
    );
}

export default function Footer({className, ...props} :
                       React.ComponentProps<"footer"> ) {

    const navigate = useNavigate();

    // Generate the footer content with navigation buttons
    function generateFooterContent() {
        const items = generateFooterItems();

        return (
            <div
                className="text-sm font-medium font-paragraph flex h-5 flex-row space-x-4 text-footer-foreground items-center">
                {items.map((item, index) => (
                    <React.Fragment key={item.url}>
                        <Button
                            className="p-0 text-sm text-muted-foreground underline-offset-4 hover:underline hover:text-link-hover"
                            variant="link"
                            onClick={() => {
                                navigate(item.url, {replace: true});
                            }}
                        >
                            {item.title}
                        </Button>
                        {/* Add separator only if there is another item after this one */}
                        {index < items.length - 1 && <Separator orientation="vertical"/>}
                    </React.Fragment>
                ))}
            </div>
        );
    }


    return (
        <footer className={cn("bg-footer p-8 mt-auto", className)} {...props}>
            <nav aria-label="Page navigation" className="grid gap-y-6 gap-x-2 items-center justify-between w-full grid-cols-1">
                <div className="flex w-full justify-between items-center">
                <h1 className="font-display text-xl">BankToo</h1>
                    <ThemeSwitch></ThemeSwitch>
                </div>

                {generateFooterContent()}

                <p className="text-muted-foreground text-xs font-paragraph font-extralight">© 2025, All rights reserved</p>

            </nav>
        </footer>
    );
}