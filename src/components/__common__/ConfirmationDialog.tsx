import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"; 

interface ConfirmationDialogProps {
    open: boolean;
    title: string;
    description: string;
    onClose: () => void;
    onConfirm: () => void;
}

const ConfirmationDialog = ({ open, onClose, onConfirm, title, description}: ConfirmationDialogProps) => {

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription> {description} </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>No</Button>
                    <Button variant="success" onClick={() => { onConfirm(); onClose(); }}>Yes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
export default ConfirmationDialog;