import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";

import ConfirmCurrentPassword from "@/components/auth/password-change/ConfirmCurrentPassword.tsx";
import * as React from "react";

interface PasswordChangeDialogProps {
  showDialog: boolean;
  setShowDialog: (open: boolean) => void;
}
export default function PasswordChangeDialog({showDialog, setShowDialog}: PasswordChangeDialogProps) {

  const handleDialogClose = (open: boolean) => {
    setShowDialog(open);
  };

  return (
    <Dialog open={showDialog} onOpenChange={handleDialogClose}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
        </DialogHeader>
        <p>In order to change your password please insert your current password.</p>

        <ConfirmCurrentPassword setShowDialog={setShowDialog} />

      </DialogContent>
    </Dialog>
  );
}

