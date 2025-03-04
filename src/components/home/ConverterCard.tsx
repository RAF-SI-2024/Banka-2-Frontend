import {Card, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {cn} from "@/lib/utils.ts";

const ConverterCard = ({ className, ...props }: React.ComponentProps<"div">) => {
    return (
        <Card className={cn("", className)} {...props}>
            <CardHeader>
                <CardTitle className="font-heading text-2xl">Converter</CardTitle>
            </CardHeader>
        </Card>
    )
}

export default ConverterCard;