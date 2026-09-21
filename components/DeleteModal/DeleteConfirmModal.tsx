"use client";

import React from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;

  onConfirm: () => void | Promise<void>;

  loading?: boolean;

  title?: string;
  description?: string;

  confirmText?: string;
  cancelText?: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  open,
  onClose,
  onConfirm,
  loading = false,

  title = "Delete Confirmation",

  description = "Are you sure you want to delete this item? This action cannot be undone.",

  confirmText = "Delete",
  cancelText = "Cancel",
}) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!loading && !value) {
          onClose();
        }
      }}
    >
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>

          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={onClose}
            >
              {cancelText}
            </Button>
          </DialogClose>

          <Button type="button" disabled={loading} onClick={onConfirm}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

            {loading ? "Deleting..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmModal;
