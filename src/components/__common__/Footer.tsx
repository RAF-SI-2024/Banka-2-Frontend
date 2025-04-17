import {Button} from "@/components/ui/button.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {useNavigate} from "react-router-dom";
import {Role} from "@/types/bank_user/user.ts";
import {AdminNavMainData} from "@/components/__common__/sidebar/nav/main/AdminNavMainData.tsx";
import {EmployeeNavMainData} from "@/components/__common__/sidebar/nav/main/EmployeeNavMainData.tsx";
import {ClientNavMainData} from "@/components/__common__/sidebar/nav/main/ClientNavMainData.tsx";
import React from "react";
import {ThemeSwitch} from "@/components/__common__/ThemeSwitch.tsx";
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
            return AdminNavMainData().flatMap(group => group.content);
        case Role.Employee:
            const actuary = sessionStorage.getItem("actuary") ? JSON.parse(sessionStorage.actuary) : {};
            return EmployeeNavMainData(actuary).flatMap(group => group.content);
        case Role.Client:
            return ClientNavMainData().flatMap(group => group.content);
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
    return items
        .filter(item => !["bank accounts", "cards"].includes(item.title.toLowerCase())) // Filter out specific items
        .flatMap(item =>
            item.items ? item.items : [item] // Include subitems if present, otherwise include the item itself
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
                className="text-sm font-medium font-paragraph flex flex-wrap gap-x-4 gap-y-2 text-footer-foreground items-center"
            >
                {items.map((item, index) => (
                    <React.Fragment key={item.url}>
                        <Button
                            className="p-0 text-sm text-muted-foreground underline-offset-4 hover:underline hover:text-link-hover"
                            variant="link"
                            onClick={() => {
                                navigate(item.url, { replace: true });
                            }}
                        >
                            {item.title}
                        </Button>
                        <div className="h-5">
                        {index < items.length - 1 && <Separator orientation="vertical"/>}
                        </div>

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
                    <ThemeSwitch className=""></ThemeSwitch>
                </div>

                {generateFooterContent()}

                <p className="text-muted-foreground text-xs font-paragraph font-extralight">© 2025, All rights reserved</p>

            </nav>
        </footer>
    );
}