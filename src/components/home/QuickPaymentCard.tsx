import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {cn} from "@/lib/utils.ts";
import {Table, TableBody, TableCell, TableRow} from "@/components/ui/table.tsx";
import { Button } from "../ui/button";

interface User{
    id: string,
    firstName: string;
    lastName: string;
}
const placeholderData: User[] = [
    {
        id: "1",
        firstName: "Bosko",
        lastName: "Zlatanovic",
    },
    {
        id: "2",
        firstName: "Mihailo",
        lastName: "Radovic",
    },
    {
        id: "3",
        firstName: "Bosko",
        lastName: "Zlatanovic",
    },
    {
        id: "4",
        firstName: "Mihailo",
        lastName: "Radovic",
    },
    {
        id: "5",
        firstName: "Bosko",
        lastName: "Zlatanovic",
    },
    {
        id: "6",
        firstName: "Mihailo",
        lastName: "Radovic",
    },
];

const QuickPaymentCard = ({ className, ...props }: React.ComponentProps<"div">) => {
    return (
        <Card className={cn("border-0 content-center", className)} {...props}>
            <CardHeader className="mb-2">
                <CardTitle className="font-heading text-2xl">Quick payment</CardTitle>
            </CardHeader>

            <CardContent className="overflow-y-auto max-h-50 mb-4 mr-4 pr-1">
                    <Table>

                    <TableBody>
                        {placeholderData.map((item) => (

                            <TableRow
                                key={item.id}
                                className="font-medium border-border text-secondary-foreground"
                            >
                                <TableCell className="p-0 rounded-2xl">

                                    <Button className="size-full font-paragraph text-base py-4 font-semibold rounded-none justify-start" variant="negative" >
                                        {item.firstName} {item.lastName}
                                    </Button>
                                </TableCell>



                            </TableRow>


                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter className="justify-center">
                <Button size="icon" variant="success" className="rounded-full">
                    <span className="icon-[ph--plus-bold]"></span>
                </Button>
            </CardFooter>
        </Card>
    )
}

export default QuickPaymentCard;