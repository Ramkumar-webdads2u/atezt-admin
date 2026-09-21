"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RetryableErrorProps {
  message: string;
  onRetry: () => void;
  isRetrying?: boolean;
  className?: string;
}

export function RetryableError({
  message,
  onRetry,
  isRetrying = false,
  className = "",
}: RetryableErrorProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-destructive flex-1">{message}</span>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onRetry}
        disabled={isRetrying}
      >
        <RefreshCw
          className={`w-3.5 h-3.5 mr-1.5 ${isRetrying ? "animate-spin" : ""}`}
        />
        Retry
      </Button>
    </div>
  );
}
