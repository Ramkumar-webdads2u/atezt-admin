"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      theme="system"
      position="top-right"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast rounded-xl border bg-background text-foreground shadow-lg",
          description: "text-sm text-muted-foreground",
          actionButton: "rounded-lg bg-primary text-primary-foreground hover:bg-primary/90",
          cancelButton: "rounded-lg bg-muted text-muted-foreground hover:bg-muted/80",
          success: "border-success text-success",
          error: "border-destructive text-destructive",
        },
      }}
      {...props}
    />
  );
}
