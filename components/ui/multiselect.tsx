"use client";

import * as React from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { InputColor, size } from "@/lib/type";
import * as PopoverPrimitive from "@radix-ui/react-popover";

// ── Variants (reuse your existing style system) ──────────────────────────────

const multiSelectVariants = cva(
  "w-full min-h-10 px-3 py-1.5 text-sm flex flex-wrap gap-1 rounded-md border border-input justify-between items-center disabled:cursor-not-allowed disabled:opacity-50 transition duration-300 cursor-pointer",
  {
    variants: {
      color: {
        default:
          "border-default-200 text-default-500 focus:outline-hidden focus:border-default-500/50 disabled:bg-default-200 placeholder:text-accent-foreground/50",
        primary:
          "border-primary text-primary focus:outline-hidden focus:border-primary/70 disabled:bg-primary/30",
        secondary:
          "border-secondary text-secondary focus:outline-hidden focus:border-secondary/70",
        info: "border-info/50 text-info focus:outline-hidden focus:border-info/70 disabled:bg-info/30",
        warning:
          "border-warning/50 text-warning focus:outline-hidden focus:border-warning/70",
        success:
          "border-success/50 text-success focus:outline-hidden focus:border-success/70",
        destructive:
          "border-destructive/50 text-destructive focus:outline-hidden focus:border-destructive/70",
      },
      size: {
        sm: "min-h-8 text-xs",
        default: "min-h-9 text-xs",
        md: "min-h-10 text-sm",
        lg: "min-h-12 text-base",
      },
    },
    defaultVariants: {
      color: "default",
      size: "default",
    },
  },
);

// ── Types ────────────────────────────────────────────────────────────────────

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface MultiSelectProps extends VariantProps<typeof multiSelectVariants> {
  options: MultiSelectOption[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  maxCount?: number; // max badges shown before "+N more"
  disabled?: boolean;
  className?: string;
  color?: InputColor;
  size?: size;
}

// ── Component ────────────────────────────────────────────────────────────────

const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  (
    {
      options,
      value = [],
      onValueChange,
      placeholder = "Select options...",
      searchable = false,
      searchPlaceholder = "Search...",
      maxCount = 3,
      disabled = false,
      className,
      color,
      size,
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");

    const toggle = (optionValue: string) => {
      const next = value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue];
      onValueChange?.(next);
    };

    const removeOne = (optionValue: string, e: React.MouseEvent) => {
      e.stopPropagation();
      onValueChange?.(value.filter((v) => v !== optionValue));
    };

    const clearAll = (e: React.MouseEvent) => {
      e.stopPropagation();
      onValueChange?.([]);
    };

    const filtered = options.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase()),
    );

    const visible = value.slice(0, maxCount);
    const overflow = value.length - maxCount;

    return (
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger asChild>
          {/* ── Trigger ── */}
          <button
            ref={ref}
            disabled={disabled}
            className={cn(multiSelectVariants({ color, size }), className)}
            aria-expanded={open}
          >
            <span className="flex flex-wrap gap-1 flex-1">
              {value.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                <>
                  {visible.map((v) => {
                    const label =
                      options.find((o) => o.value === v)?.label ?? v;
                    return (
                      <Badge key={v} onRemove={(e) => removeOne(v, e)}>
                        {label}
                      </Badge>
                    );
                  })}
                  {overflow > 0 && (
                    <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      +{overflow} more
                    </span>
                  )}
                </>
              )}
            </span>

            <span className="flex items-center gap-1 shrink-0 ms-1">
              {value.length > 0 && !disabled && (
                <X
                  className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground"
                  onClick={clearAll}
                />
              )}
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform duration-200",
                  open && "rotate-180",
                )}
              />
            </span>
          </button>
        </PopoverPrimitive.Trigger>

        {/* ── Dropdown ── */}
        <PopoverPrimitive.Content
          className={cn(
            "z-50 w-[var(--radix-popover-trigger-width)] rounded-md border bg-popover shadow-md outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          )}
          align="start"
          sideOffset={4}
        >
          {searchable && (
            <div className="p-2 border-b">
              <input
                autoFocus
                type="text"
                placeholder={searchPlaceholder}
                className="w-full rounded border px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-ring bg-background"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
              />
            </div>
          )}

          <div className="max-h-60 overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <p className="p-2 text-center text-sm text-muted-foreground">
                No results
              </p>
            ) : (
              filtered.map((opt) => {
                const selected = value.includes(opt.value);
                return (
                  <div
                    key={opt.value}
                    role="option"
                    aria-selected={selected}
                    aria-disabled={opt.disabled}
                    onClick={() => !opt.disabled && toggle(opt.value)}
                    className={cn(
                      "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      selected && "bg-accent/50",
                      opt.disabled &&
                        "pointer-events-none opacity-50 cursor-default",
                    )}
                  >
                    {/* Checkbox */}
                    <span
                      className={cn(
                        "mr-2 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-primary",
                        selected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-60",
                      )}
                    >
                      {selected && <Check className="h-3 w-3" />}
                    </span>
                    {opt.label}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer: select-all / clear */}
          {options.length > 0 && (
            <div className="border-t p-2 flex justify-between text-xs text-muted-foreground">
              <button
                className="hover:text-foreground transition-colors"
                onClick={() =>
                  onValueChange?.(
                    options.filter((o) => !o.disabled).map((o) => o.value),
                  )
                }
              >
                Select all
              </button>
              <button
                className="hover:text-foreground transition-colors"
                onClick={() => onValueChange?.([])}
              >
                Clear
              </button>
            </div>
          )}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Root>
    );
  },
);
MultiSelect.displayName = "MultiSelect";

// ── Badge subcomponent ───────────────────────────────────────────────────────

function Badge({
  children,
  onRemove,
}: {
  children: React.ReactNode;
  onRemove: (e: React.MouseEvent) => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium">
      {children}
      <X
        className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors"
        onClick={onRemove}
      />
    </span>
  );
}

export { MultiSelect };
