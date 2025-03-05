import {Card} from "@/components/ui/card.tsx";
import {cn} from "@/lib/utils.ts";

const QuickPaymentCard = ({ className, ...props }: React.ComponentProps<"div">) => {
    return (
        <Card className={cn("border-0", className)} {...props}>

        </Card>
    )
}

export default QuickPaymentCard;