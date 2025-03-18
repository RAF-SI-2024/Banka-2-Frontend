import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteConfirmationDialog = ({ open, onClose, onConfirm }: DeleteConfirmationDialogProps) => {

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure you want to delete this template?</DialogTitle>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="negative" onClick={onClose}>No</Button>
                    <Button variant="primary" onClick={() => { onConfirm(); onClose(); }}>Yes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteConfirmationDialog;