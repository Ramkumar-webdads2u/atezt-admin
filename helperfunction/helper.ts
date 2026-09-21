export const formatDateTime = (dateString: any) => {
  if (!dateString) return "-";

  const formatted = new Date(dateString).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  // Force AM/PM uppercase
  return formatted.replace(/\b(am|pm)\b/g, (match) => match.toUpperCase());
};

// Analytics herlpers
export const formatDate = (year: number, month: number, day: number) => {
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export const formatMinutes = (min: number | null) => {
  if (min === null) return "—";
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

export interface AnalyticsFilters {
  serviceType?: string;
  serviceArea?: string;
  groupBy?: "day" | "week" | "month" | "year";
  fromDate?: string;
  toDate?: string;
}

export function buildQueryString(filters: AnalyticsFilters): string {
  const params = new URLSearchParams();
  if (filters.serviceType) params.set("serviceType", filters.serviceType);
  if (filters.serviceArea) params.set("serviceArea", filters.serviceArea);
  if (filters.groupBy) params.set("groupBy", filters.groupBy);
  if (filters.fromDate) params.set("fromDate", filters.fromDate);
  if (filters.toDate) params.set("toDate", filters.toDate);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function formatPeriodLabel(
  id: { year?: number; month?: number; day?: number; week?: number },
  groupBy: AnalyticsFilters["groupBy"] = "day",
) {
  const year = id?.year;
  const month = id?.month;
  const day = id?.day;
  const week = id?.week;

  switch (groupBy) {
    case "week":
      return year && week ? `Week${week} ${year}` : "-";

    case "month":
      if (!year || !month) return "-";
      return new Date(year, month - 1, 1).toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      });

    case "year":
      return year ? String(year) : "-";

    case "day":
    default:
      if (!year || !month || !day) return "-";
      return new Date(year, month - 1, day).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
      });
  }
}
