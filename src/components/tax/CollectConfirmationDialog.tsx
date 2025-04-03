import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React from "react";

interface CollectConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    fullName: string;
}

const CollectConfirmationDialog = ({
                                       open,
                                       onClose,
                                       onConfirm,
                                       fullName,
                                   }: CollectConfirmationDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure you want to collect taxes?</DialogTitle>
                    <DialogDescription>
                        By clicking yes, taxes will be collected from {fullName}.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>No</Button>
                    <Button variant="success" onClick={() => { onConfirm(); onClose(); }}>
                        Yes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CollectConfirmationDialog;
