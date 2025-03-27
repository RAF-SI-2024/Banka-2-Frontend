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
import React from "react";

interface ResetLimitConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const ResetLimitConfirmDialog = ({ open, onClose, onConfirm }: ResetLimitConfirmDialogProps) => {

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure you want to reset your used limit?</DialogTitle>
                    <DialogDescription>
                        By clicking yes you will reset your used limit.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>No</Button>
                    <Button variant="success" onClick={() => { onConfirm(); onClose(); }}>Yes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
export default ResetLimitConfirmDialog;