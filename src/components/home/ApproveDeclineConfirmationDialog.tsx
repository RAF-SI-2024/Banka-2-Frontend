import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React from "react";

interface ApproveDeclineConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    actionType: "approve" | "decline";
}

const ApproveDeclineConfirmationDialog = ({
                                              open,
                                              onClose,
                                              onConfirm,
                                              actionType
                                          }: ApproveDeclineConfirmationDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {actionType === "approve" ? "Approve Order" : "Decline Order"}
                    </DialogTitle>
                    <DialogDescription>
                        {actionType === "approve"
                            ? "By clicking yes, the order will be approved."
                            : "By clicking yes, the order will be declined."}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>No</Button>
                    <Button
                        variant={actionType === "approve" ? "success" : "destructive"}
                        onClick={() => { onConfirm(); onClose(); }}
                    >
                        Yes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ApproveDeclineConfirmationDialog;
