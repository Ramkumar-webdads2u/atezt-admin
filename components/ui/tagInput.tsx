"use client";
import React, { useRef, KeyboardEvent } from "react";
import { X } from "lucide-react";

export interface DropdownOption {
  _id?: string;
  label: string;
  isActive: boolean;
}

interface TagInputProps {
  value: DropdownOption[];
  onChange: (options: DropdownOption[]) => void;
  placeholder?: string;
  maxTags?: number;
  disabled?: boolean;
  className?: string;
}

export default function TagInput({
  value,
  onChange,
  placeholder = "Type and press Enter…",
  maxTags,
  disabled = false,
  className = "",
}: TagInputProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [editingValue, setEditingValue] = React.useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    if (value.some((o) => o.label === trimmed)) {
      setInputValue("");
      return;
    }
    if (maxTags && value.length >= maxTags) return;
    onChange([...value, { label: trimmed, isActive: true }]);
    setInputValue("");
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const toggleActive = (index: number) => {
    onChange(
      value.map((opt, i) =>
        i === index ? { ...opt, isActive: !opt.isActive } : opt
      )
    );
  };

  // ── Edit handlers ──────────────────────────────────────────
  const startEditing = (index: number) => {
    if (disabled) return;
    setEditingIndex(index);
    setEditingValue(value[index].label);
    // Focus the edit input after render
    setTimeout(() => editInputRef.current?.focus(), 0);
  };

  const commitEdit = () => {
    if (editingIndex === null) return;
    const trimmed = editingValue.trim();

    if (
      trimmed &&
      !value.some((o, i) => i !== editingIndex && o.label === trimmed)
    ) {
      onChange(
        value.map((opt, i) =>
          i === editingIndex ? { ...opt, label: trimmed } : opt
        )
      );
    }
    setEditingIndex(null);
    setEditingValue("");
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingValue("");
  };

  const handleEditKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };
  // ──────────────────────────────────────────────────────────

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    } else if (e.key === "Escape") {
      setInputValue("");
    }
  };

  const isAtMax = !!maxTags && value.length >= maxTags;

  return (
    <div className={className}>
      <div
        className={`flex flex-wrap gap-2 min-h-[44px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors
          ${disabled ? "cursor-not-allowed opacity-50" : "cursor-text"}
          focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2`}
        onClick={() => !disabled && inputRef.current?.focus()}
      >
        {value.map((opt, index) => (
          <span
            key={opt._id ?? `${opt.label}-${index}`}
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-sm font-medium leading-none border transition-colors
              ${opt.isActive
                ? "bg-primary/10 text-primary border-primary/20"
                : "bg-muted text-muted-foreground border-border line-through"
              }`}
          >
            {/* ── Inline edit input OR label ── */}
            {editingIndex === index ? (
              <input
                ref={editInputRef}
                type="text"
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                onKeyDown={handleEditKeyDown}
                onBlur={commitEdit}
                onClick={(e) => e.stopPropagation()}
                className="bg-transparent outline-none w-auto min-w-[60px] max-w-[160px] text-sm font-medium"
                style={{ width: `${Math.max(editingValue.length, 4)}ch` }}
              />
            ) : (
              <span
                title="Double-click to edit"
                onClick={(e) => {
                  e.stopPropagation();
                  startEditing(index);
                }}
                className="cursor-text select-none"
              >
                {opt.label}
              </span>
            )}

            {/* Active / Inactive toggle dot */}
            {!disabled && editingIndex !== index && (
              <button
                type="button"
                title={opt.isActive ? "Click to deactivate" : "Click to activate"}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleActive(index);
                }}
                className={`w-3 h-3 rounded-full flex-shrink-0 transition-colors focus:outline-none
                  ${opt.isActive ? "bg-green-500 hover:bg-yellow-400" : "bg-red-400 hover:bg-green-400"}`}
                aria-label={opt.isActive ? "Deactivate" : "Activate"}
              />
            )}

            {/* Remove button */}
            {!disabled && editingIndex !== index && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(index);
                }}
                className="ml-0.5 rounded-full hover:text-destructive transition-colors focus:outline-none"
                aria-label={`Remove "${opt.label}"`}
              >
                <X size={11} strokeWidth={2.5} />
              </button>
            )}
          </span>
        ))}

        {!isAtMax && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={addTag}
            disabled={disabled}
            placeholder={value.length === 0 ? placeholder : ""}
            className="flex-1 min-w-[140px] bg-transparent outline-none placeholder:text-muted-foreground text-sm disabled:cursor-not-allowed"
          />
        )}
      </div>

      {/* Hint row */}
      <div className="flex items-center justify-between mt-1">
        <p className="text-xs text-muted-foreground">
          Press{" "}
          <kbd className="px-1 py-0.5 rounded border border-border text-[10px] font-mono">
            Enter
          </kbd>{" "}
          to add ·{" "}
          <kbd className="px-1 py-0.5 rounded border border-border text-[10px] font-mono">
            Double-click
          </kbd>{" "}
          tag to edit ·{" "}
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            = active
          </span>{" "}
          ·{" "}
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
            = inactive
          </span>
        </p>
        {maxTags && (
          <p className={`text-xs ${isAtMax ? "text-destructive" : "text-muted-foreground"}`}>
            {value.length}/{maxTags}
          </p>
        )}
      </div>
    </div>
  );
}