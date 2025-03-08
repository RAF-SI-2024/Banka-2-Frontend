import {Dialog, DialogContent, DialogDescription, DialogTitle} from "@/components/ui/dialog.tsx";
import RegisterPage from "@/pages/Register.tsx";
import {Role} from "@/types/enums.ts";
import {useMediaQuery} from "@/hooks/use-media-query.ts";
import {Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerTitle} from "../ui/drawer";
import {Button} from "@/components/ui/button.tsx";

interface RegisterDialogProps {
    variant: Role,
    open: boolean;
    onClose: () => void;
    onSuccess?: (email: string) => void;
}

export default function RegisterDialog({ variant, open, onClose, onSuccess }: RegisterDialogProps) {
    const isDesktop = useMediaQuery("(min-width: 1500px)");

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="!w-full !max-w-3xl !max-h-[95vh] bg-card overflow-hidden">
                    <DialogTitle></DialogTitle>
                    <DialogDescription></DialogDescription>
                    <div className="p-4 w-full overflow-y-auto h-full">
                        <RegisterPage
                            onClose={(email) => {
                                onClose();
                                if (email && onSuccess) {
                                    onSuccess(email);
                                }
                            }}
                            variant={variant}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={onClose}>
            <DrawerContent className="bg-card !max-h-11/12">
                <DrawerTitle></DrawerTitle>
                <DrawerDescription></DrawerDescription>
                <div className="p-4 w-full overflow-y-auto h-full">
                    <RegisterPage
                        onClose={(email) => {
                            onClose();
                            if (email && onSuccess) {
                                onSuccess(email);
                            }
                        }}
                        variant={variant}
                    />
                </div>
                <DrawerFooter className="pt-2 self-center w-full max-w-3xl ">
                    <DrawerClose asChild>
                        <Button variant="outline" className="w-full">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );


}