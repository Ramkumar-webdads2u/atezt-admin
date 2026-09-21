"use client";
import React from "react";
import { Toggle } from "@/components/ui/toggle";
import { Label } from "@/components/ui/label";

interface StatusToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  showDescription?: boolean;
}

/**
 * StatusToggle — Active / Inactive toggle with labelled states
 *
 * Usage:
 *   const [isActive, setIsActive] = useState(true);
 *   <StatusToggle value={isActive} onChange={setIsActive} />
 *
 * Props:
 *   value            boolean   — current status
 *   onChange         fn        — called with new boolean on change
 *   disabled         boolean   — disables interaction (default: false)
 *   showDescription  boolean   — shows helper text (default: true)
 */
export default function StatusToggle({
  value,
  onChange,
  disabled = false,
  showDescription = true,
}: StatusToggleProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border px-4 py-3 w-full">
      {/* Left: label + description */}
      <div>
        <Label>Status</Label>
        {showDescription && (
          <p className="text-xs text-muted-foreground mt-0.5">
            Control whether this service is publicly visible
          </p>
        )}
      </div>

      {/* Right: Inactive ← toggle → Active */}
      <div className="flex items-center gap-3">
        <span
          className={`text-sm font-medium transition-colors ${
            !value ? "text-destructive" : "text-muted-foreground"
          }`}
        >
          Inactive
        </span>

        <Toggle
          pressed={value}
          onPressedChange={onChange}
          disabled={disabled}
          className="w-10 h-6 rounded-full bg-gray-300 data-[state=on]:bg-green-500 relative
            before:absolute before:top-0.5 before:left-0.5 before:w-5 before:h-5
            before:rounded-full before:bg-white before:shadow-md before:transition-transform
            data-[state=on]:before:translate-x-4
            disabled:cursor-not-allowed disabled:opacity-50"
        />

        <span
          className={`text-sm font-medium transition-colors ${
            value ? "text-green-600" : "text-muted-foreground"
          }`}
        >
          Active
        </span>
      </div>
    </div>
  );
}

/**
 * StatusBadge — inline pill badge showing current status
 *
 * Usage:
 *   <StatusBadge isActive={true} />
 */
export function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
        ${isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}