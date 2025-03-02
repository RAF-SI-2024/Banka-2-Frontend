import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import ConfirmCurrentPassword from "@/components/passwordChange/ConfirmCurrentPassword.tsx";
import {useState} from "react";
import {ErrorAlert} from "@/components/common/ErrorAlert.tsx";
import * as React from "react";

interface PasswordChangeDialogProps {
  showDialog: boolean;
  setShowDialog: (open: boolean) => void;
  user: {
    name: string
    email: string
    avatar: string
  };
}
export default function PasswordChangeDialog({showDialog, setShowDialog, user}: PasswordChangeDialogProps) {

  const [error, setError] = useState<{ id: number; title: string; description: string } | null>(null);

  const handleDialogClose = (open: boolean) => {
    setShowDialog(open);
    if (!open) {
      setError(null);
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={handleDialogClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
        </DialogHeader>
        <p>In order to change your password please insert your current password.</p>

        <ConfirmCurrentPassword user={user} setErrors={setError} setShowDialog={setShowDialog} />

        {error && [error].map((error) => (
          <ErrorAlert
            key={error.id}
            title={error.title}
            description={error.description}
            onClose={() => setError(null)}
          />
        ))}
      </DialogContent>
    </Dialog>
  );
}

