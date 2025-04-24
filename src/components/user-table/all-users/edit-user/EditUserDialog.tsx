import * as React from "react";
import { useMediaQuery } from "@/hooks/use-media-query.ts";
import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer.tsx";
import EditUserForm from "./EditUserForm.tsx";

interface EditUserDialogProps {
  id: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}
export function EditUserDialog({ id, isOpen, onOpenChange }: EditUserDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleClose = () => {
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] bg-card">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Click "Update" when you're done.
            </DialogDescription>
          </DialogHeader>
          <EditUserForm id_={id} onClose={handleClose} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-card">
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>
        <EditUserForm className="px-4" id_={id} onClose={handleClose} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}