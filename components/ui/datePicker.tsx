import { useState } from "react";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDate(date: Date | null): string {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

interface DatePickerProps {
  label?: string;
  placeholder?: string;
  value?: Date | null;
  onChange?: (date: Date | null) => void;
}

export default function DatePicker({
  label = "Date",
  placeholder = "Select a date",
  value,
  onChange,
}: DatePickerProps) {
  const today = new Date();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Date | null>(value ?? null);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const handleSelect = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    setSelected(date);
    onChange?.(date);
    setOpen(false);
  };

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const isSelected = (day: number) =>
    selected &&
    selected.getFullYear() === viewYear &&
    selected.getMonth() === viewMonth &&
    selected.getDate() === day;

  const isToday = (day: number) =>
    today.getFullYear() === viewYear &&
    today.getMonth() === viewMonth &&
    today.getDate() === day;

  const cells = Array(firstDay)
    .fill(null)
    .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  return (
    <div
      style={{
        position: "relative",
        fontFamily: "'DM Sans', sans-serif",
        width: "100%",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

        .dp-label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 6px;
        }

        .dp-input {
          width: 100%;
          box-sizing: border-box;
          padding: 10px 40px 10px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #111827;
          background: #fff;
          cursor: pointer;
          outline: none;
          transition: border-color 0.15s;
          text-align: left;
        }

        .dp-input:hover { border-color: #d1d5db; }
        .dp-input:focus, .dp-input.open { border-color: #6b7280; box-shadow: 0 0 0 3px rgba(107,114,128,0.1); }
        .dp-input.placeholder { color: #9ca3af; }

        .dp-icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          pointer-events: none;
        }

        .dp-dropdown {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          z-index: 100;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.10);
          padding: 16px;
          width: 280px;
          animation: dp-fade 0.15s ease;
        }

        @keyframes dp-fade {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .dp-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .dp-nav {
          background: none;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #6b7280;
          transition: background 0.12s, color 0.12s;
          padding: 0;
        }

        .dp-nav:hover { background: #f3f4f6; color: #111827; }

        .dp-month-label {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
        }

        .dp-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 2px;
        }

        .dp-day-name {
          font-size: 11px;
          font-weight: 600;
          color: #9ca3af;
          text-align: center;
          padding: 4px 0 8px;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .dp-cell {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          border-radius: 6px;
          cursor: pointer;
          color: #374151;
          transition: background 0.1s, color 0.1s;
          position: relative;
        }

        .dp-cell:hover { background: #f3f4f6; }

        .dp-cell.today {
          font-weight: 600;
          color: #111827;
        }

        .dp-cell.today::after {
          content: '';
          position: absolute;
          bottom: 3px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #6b7280;
        }

        .dp-cell.selected {
          background: #111827 !important;
          color: #fff !important;
        }

        .dp-cell.selected::after { display: none; }

        .dp-cell.empty { cursor: default; }
        .dp-cell.empty:hover { background: none; }

        .dp-footer {
          margin-top: 12px;
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .dp-btn {
          padding: 7px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.12s;
        }

        .dp-btn-cancel {
          background: #fff;
          border: 1px solid #e5e7eb;
          color: #374151;
        }

        .dp-btn-cancel:hover { background: #f9fafb; }

        .dp-btn-today {
          background: #111827;
          border: 1px solid #111827;
          color: #fff;
        }

        .dp-btn-today:hover { background: #1f2937; }
      `}</style>

      {label && <label className="dp-label">{label}</label>}

      <div style={{ position: "relative" }}>
        <button
          className={`dp-input ${open ? "open" : ""} ${!selected ? "placeholder" : ""}`}
          onClick={() => setOpen((o) => !o)}
        >
          {selected ? formatDate(selected) : placeholder}
        </button>

        {/* Calendar icon */}
        <span className="dp-icon">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </span>

        {open && (
          <div className="dp-dropdown">
            {/* Header */}
            <div className="dp-header">
              <button className="dp-nav" onClick={prevMonth}>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <span className="dp-month-label">
                {MONTHS[viewMonth]} {viewYear}
              </span>
              <button className="dp-nav" onClick={nextMonth}>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>

            {/* Day names */}
            <div className="dp-grid">
              {DAYS.map((d) => (
                <div key={d} className="dp-day-name">
                  {d}
                </div>
              ))}

              {/* Day cells */}
              {cells.map((day, i) => (
                <div
                  key={i}
                  className={`dp-cell ${!day ? "empty" : ""} ${day && isSelected(day) ? "selected" : ""} ${day && isToday(day) && !isSelected(day) ? "today" : ""}`}
                  onClick={() => day && handleSelect(day)}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="dp-footer">
              <button
                className="dp-btn dp-btn-cancel"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                className="dp-btn dp-btn-today"
                onClick={() => {
                  const t = new Date();
                  setViewYear(t.getFullYear());
                  setViewMonth(t.getMonth());
                  handleSelect(t.getDate());
                }}
              >
                Today
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
