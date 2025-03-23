import {Dialog, DialogContent, DialogDescription, DialogTitle} from "@/components/ui/dialog.tsx";
import {useMediaQuery} from "@/hooks/use-media-query.ts";
import {Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerTitle} from "../../ui/drawer.tsx";
import {Button} from "@/components/ui/button.tsx";
import CreateBankAccount from "@/components/bank-account/bank-account-create/CreateBankAccount.tsx";

interface CreateBankAccountDialogProps {
    open: boolean;
    onClose: () => void;
    onRegister: () => void;
    registeredEmail?: string;  // Add email prop
}

export default function CreateBankAccountDialog({ open, onClose, onRegister, registeredEmail }: CreateBankAccountDialogProps) {
    const isDesktop = useMediaQuery("(min-width: 1000px)");

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="!w-full !max-w-xl !max-h-[95vh] bg-card overflow-hidden">
                    <DialogTitle></DialogTitle>
                    <DialogDescription></DialogDescription>
                    <div className="p-4 w-full overflow-y-auto h-full">
                        <CreateBankAccount
                            onRegister={onRegister}
                            registeredEmail={registeredEmail}
                            onClose={onClose}
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
                <div className="p-4 flex justify-center w-full overflow-y-auto h-full">
                    <CreateBankAccount
                        onRegister={onRegister}
                        registeredEmail={registeredEmail}
                        onClose={onClose}
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