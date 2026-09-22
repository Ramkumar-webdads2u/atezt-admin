"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

import {
  Users,
  UserCheck,
  UserX,
  IndianRupee,
  FolderOpen,
  FileText,
  BarChart3,
  TrendingUp,
} from "lucide-react";

import useReactQuery from "@/hooks/useReactQuery";

import { RetryableError } from "@/components/ui/RetryableError";

interface DashboardChartItem {
  year?: number;
  month?: number;
  label: string;
  users?: number;
  revenue?: number;
}

interface DashboardResponse {
  year: number;
  period: "yearly" | "monthly";

  users: {
    total: number;
    active: number;
    inactive: number;
    chart: DashboardChartItem[];
  };

  revenue: {
    total: number;
    currency: string;
    chart: DashboardChartItem[];
  };

  exam_categories: number;
  exams: number;
  exam_per_user: number;
}

interface RecentResult {
  attempt_id: number;
  user_name: string;
  exam: string;
  score: number;
  out_of: number;
  percentage: number;
  result: string;
  submitted_at: string;
}

interface RecentResultsResponse {
  recent_results: RecentResult[];
}

const GREEN = "#16A34A";

function DashboardList() {
  const currentYear = new Date().getFullYear();

  const [period, setPeriod] = useState<"monthly" | "yearly">("monthly");

  const [year, setYear] = useState(currentYear);

  // =========================
  // DASHBOARD QUERY
  // =========================

  const dashboardQueryString = useMemo(() => {
    const params = new URLSearchParams();

    params.set("period", period);
    params.set("year", String(year));

    return `?${params.toString()}`;
  }, [period, year]);

  const {
    data: dashboardResponse,
    isLoading: dashboardLoading,
    isError: dashboardError,
    refetch: refetchDashboard,
  } = useReactQuery<DashboardResponse>("Dashboard", dashboardQueryString);

  // =========================
  // RECENT RESULTS
  // =========================

  const {
    data: recentResponse,
    isLoading: recentLoading,
    isError: recentError,
    refetch: refetchRecentResults,
  } = useReactQuery<RecentResultsResponse>("RecentResults");

  const isLoading = dashboardLoading || recentLoading;

  const isError = dashboardError || recentError;

  // =========================
  // ERROR
  // =========================

  if (isError) {
    return (
      <RetryableError
        message="Failed to load dashboard"
        onRetry={() => {
          refetchDashboard();
          refetchRecentResults();
        }}
      />
    );
  }

  const dashboard = dashboardResponse;

  const recentResults = recentResponse?.recent_results ?? [];

  const usersChart = dashboard?.users?.chart ?? [];

  const revenueChart = dashboard?.revenue?.chart ?? [];

  // =========================
  // MAX VALUES
  // =========================

  const maxUsers = Math.max(...usersChart.map((item) => item.users ?? 0), 1);

  const maxRevenue = Math.max(
    ...revenueChart.map((item) => item.revenue ?? 0),
    1,
  );

  // =========================
  // YEARS
  // =========================

  const years = Array.from({ length: 5 }, (_, index) => currentYear - index);

  return (
    <div className="w-full space-y-6 px-5 py-4">
      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <motion.div
        initial={{
          opacity: 0,
          y: -10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
        }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

          <p className="text-sm text-muted-foreground">
            Overview of users, revenue and exam activity.
          </p>
        </div>

        {/* ========================= */}
        {/* FILTERS */}
        {/* ========================= */}

        <div className="flex items-center gap-3">
          {/* Period */}

          <select
            value={period}
            onChange={(event) => {
              setPeriod(event.target.value as "monthly" | "yearly");
            }}
            className="h-9 rounded-md border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-green-600/20"
          >
            <option value="monthly">Monthly</option>

            <option value="yearly">Yearly</option>
          </select>

          {/* Year */}

          <select
            value={year}
            onChange={(event) => {
              setYear(Number(event.target.value));
            }}
            className="h-9 rounded-md border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-green-600/20"
          >
            {years.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* ========================= */}
      {/* SUMMARY CARDS */}
      {/* ========================= */}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Total Users */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
            delay: 0.05,
          }}
          className="rounded-xl border bg-background p-5"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>

              <motion.p
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                className="mt-2 text-2xl font-semibold"
              >
                {isLoading ? "..." : (dashboard?.users?.total ?? 0)}
              </motion.p>
            </div>

            <div
              className="rounded-lg p-2"
              style={{
                backgroundColor: `${GREEN}15`,
              }}
            >
              <Users
                className="h-5 w-5"
                style={{
                  color: GREEN,
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Active Users */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
            delay: 0.1,
          }}
          className="rounded-xl border bg-background p-5"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Users</p>

              <motion.p
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                className="mt-2 text-2xl font-semibold"
              >
                {isLoading ? "..." : (dashboard?.users?.active ?? 0)}
              </motion.p>
            </div>

            <div
              className="rounded-lg p-2"
              style={{
                backgroundColor: `${GREEN}15`,
              }}
            >
              <UserCheck
                className="h-5 w-5"
                style={{
                  color: GREEN,
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Inactive Users */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
            delay: 0.15,
          }}
          className="rounded-xl border bg-background p-5"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Inactive Users</p>

              <motion.p
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                className="mt-2 text-2xl font-semibold"
              >
                {isLoading ? "..." : (dashboard?.users?.inactive ?? 0)}
              </motion.p>
            </div>

            <div className="rounded-lg bg-muted p-2">
              <UserX className="h-5 w-5 text-red-500" />
            </div>
          </div>
        </motion.div>

        {/* Revenue */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
            delay: 0.2,
          }}
          className="rounded-xl border bg-background p-5"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>

              <motion.p
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                className="mt-2 text-2xl font-semibold"
              >
                {isLoading
                  ? "..."
                  : `${dashboard?.revenue?.currency === "INR" ? "₹" : ""}${
                      dashboard?.revenue?.total ?? 0
                    }`}
              </motion.p>
            </div>

            <div
              className="rounded-lg p-2"
              style={{
                backgroundColor: `${GREEN}15`,
              }}
            >
              <IndianRupee
                className="h-5 w-5"
                style={{
                  color: GREEN,
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* ========================= */}
      {/* EXAM SUMMARY */}
      {/* ========================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Exam Categories */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
            delay: 0.25,
          }}
          className="rounded-xl border bg-background p-5"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-muted p-3">
              <FolderOpen className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Exam Categories</p>

              <p className="mt-1 text-2xl font-semibold">
                {isLoading ? "..." : (dashboard?.exam_categories ?? 0)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Exams */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
            delay: 0.3,
          }}
          className="rounded-xl border bg-background p-5"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-muted p-3">
              <FileText className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Exams</p>

              <p className="mt-1 text-2xl font-semibold">
                {isLoading ? "..." : (dashboard?.exams ?? 0)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Exam Per User */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
            delay: 0.35,
          }}
          className="rounded-xl border bg-background p-5"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-muted p-3">
              <BarChart3 className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Exams Per User</p>

              <p className="mt-1 text-2xl font-semibold">
                {isLoading ? "..." : (dashboard?.exam_per_user ?? 0)}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ========================= */}
      {/* USERS + REVENUE CHARTS */}
      {/* ========================= */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ========================= */}
        {/* USERS CHART */}
        {/* ========================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            delay: 0.4,
          }}
          className="rounded-xl border bg-background p-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">Users</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {period === "monthly"
                  ? `${year} monthly user overview`
                  : `${year} yearly user overview`}
              </p>
            </div>

            <div
              className="rounded-lg p-2"
              style={{
                backgroundColor: `${GREEN}15`,
              }}
            >
              <TrendingUp
                className="h-5 w-5"
                style={{
                  color: GREEN,
                }}
              />
            </div>
          </div>

          <div className="mt-8">
            {dashboardLoading ? (
              <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
                Loading users chart...
              </div>
            ) : usersChart.length === 0 ? (
              <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
                No user chart data available.
              </div>
            ) : (
              <div className="relative h-[280px]">
                {/* Grid */}

                <div className="absolute inset-x-0 bottom-10 top-0 flex flex-col justify-between">
                  {[4, 3, 2, 1, 0].map((line) => (
                    <div
                      key={line}
                      className="border-t border-dashed border-muted"
                    />
                  ))}
                </div>

                {/* Bars */}

                <div className="absolute inset-x-0 bottom-10 top-0 flex items-end justify-around gap-1 px-1 sm:gap-2 sm:px-2">
                  {usersChart.map((item, index) => {
                    const value = item.users ?? 0;

                    const height = (value / maxUsers) * 100;

                    return (
                      <div
                        key={item.month ?? item.year ?? index}
                        className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                      >
                        <span className="mb-2 text-[10px] font-medium text-muted-foreground sm:text-xs">
                          {value === 0 ? "-" : `₹${value}`}
                        </span>

                        <motion.div
                          initial={{
                            height: 0,
                            opacity: 0,
                          }}
                          animate={{
                            height: `${Math.max(height, value > 0 ? 4 : 0)}%`,
                            opacity: 1,
                          }}
                          transition={{
                            duration: 0.7,
                            delay: 0.1 + index * 0.04,
                            ease: "easeOut",
                          }}
                          whileHover={{
                            scaleX: 1.08,
                          }}
                          className="w-full max-w-[42px] rounded-t-md sm:max-w-[52px]"
                          style={{
                            backgroundColor: GREEN,
                          }}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* X Axis */}

                <div className="absolute inset-x-0 bottom-0 flex items-center justify-around gap-1 border-t pt-3 sm:gap-2">
                  {usersChart.map((item, index) => (
                    <span
                      key={`user-label-${item.month ?? item.year ?? index}`}
                      className="min-w-0 flex-1 text-center text-[10px] text-muted-foreground sm:text-xs"
                    >
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Users Summary */}

          <div className="mt-5 flex items-end justify-between border-t pt-5">
            <div>
              <motion.p
                initial={{
                  opacity: 0,
                  y: 5,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="text-3xl font-semibold"
                style={{
                  color: GREEN,
                }}
              >
                {dashboard?.users?.total ?? 0}
              </motion.p>

              <p className="text-sm text-muted-foreground">Total Users</p>
            </div>

            <div className="text-right">
              <p
                className="text-base font-semibold"
                style={{
                  color: GREEN,
                }}
              >
                {dashboard?.users?.active ?? 0} Active Users
              </p>

              <p className="text-sm text-muted-foreground">
                {dashboard?.users?.inactive ?? 0} Inactive Users
              </p>
            </div>
          </div>
        </motion.div>

        {/* ========================= */}
        {/* REVENUE CHART */}
        {/* ========================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            delay: 0.5,
          }}
          className="rounded-xl border bg-background p-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">Revenue</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {period === "monthly"
                  ? `${year} monthly revenue overview`
                  : `${year} yearly revenue overview`}
              </p>
            </div>

            <div
              className="rounded-lg p-2"
              style={{
                backgroundColor: `${GREEN}15`,
              }}
            >
              <IndianRupee
                className="h-5 w-5"
                style={{
                  color: GREEN,
                }}
              />
            </div>
          </div>

          <div className="mt-8">
            {dashboardLoading ? (
              <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
                Loading revenue chart...
              </div>
            ) : revenueChart.length === 0 ? (
              <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
                No revenue chart data available.
              </div>
            ) : (
              <div className="relative h-[280px]">
                {/* Grid */}

                <div className="absolute inset-x-0 bottom-10 top-0 flex flex-col justify-between">
                  {[4, 3, 2, 1, 0].map((line) => (
                    <div
                      key={line}
                      className="border-t border-dashed border-muted"
                    />
                  ))}
                </div>

                {/* Bars */}

                <div className="absolute inset-x-0 bottom-10 top-0 flex items-end justify-around gap-1 px-1 sm:gap-2 sm:px-2">
                  {revenueChart.map((item, index) => {
                    const value = item.revenue ?? 0;

                    const height = (value / maxRevenue) * 100;

                    return (
                      <div
                        key={item.month ?? item.year ?? index}
                        className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                      >
                        <span className="mb-2 text-[10px] font-medium text-muted-foreground sm:text-xs">
                          ₹{value}
                        </span>

                        <motion.div
                          initial={{
                            height: 0,
                            opacity: 0,
                          }}
                          animate={{
                            height: `${Math.max(height, value > 0 ? 4 : 0)}%`,
                            opacity: 1,
                          }}
                          transition={{
                            duration: 0.7,
                            delay: 0.15 + index * 0.04,
                            ease: "easeOut",
                          }}
                          whileHover={{
                            scaleX: 1.08,
                          }}
                          className="w-full max-w-[42px] rounded-t-md sm:max-w-[52px]"
                          style={{
                            backgroundColor: GREEN,
                          }}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* X Axis */}

                <div className="absolute inset-x-0 bottom-0 flex items-center justify-around gap-1 border-t pt-3 sm:gap-2">
                  {revenueChart.map((item, index) => (
                    <span
                      key={`revenue-label-${item.month ?? item.year ?? index}`}
                      className="min-w-0 flex-1 text-center text-[10px] text-muted-foreground sm:text-xs"
                    >
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Revenue Summary */}

          <div className="mt-5 flex items-end justify-between border-t pt-5">
            <div>
              <motion.p
                initial={{
                  opacity: 0,
                  y: 5,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="text-3xl font-semibold"
                style={{
                  color: GREEN,
                }}
              >
                {dashboard?.revenue?.currency === "INR" ? "₹" : ""}
                {dashboard?.revenue?.total ?? 0}
              </motion.p>

              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </div>

            <div className="text-right">
              <p className="text-sm text-muted-foreground">Active Year</p>

              <p className="text-base font-medium">{dashboard?.year ?? year}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ========================= */}
      {/* RECENT RESULTS */}
      {/* ========================= */}

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
          delay: 0.6,
        }}
        className="rounded-xl border bg-background"
      >
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h2 className="font-semibold">Recent Results</h2>

            <p className="text-sm text-muted-foreground">
              Latest exam attempts and results.
            </p>
          </div>

          <Link
            href="results"
            className="text-sm font-medium text-green-600 transition-colors hover:text-green-700"
          >
            See More
          </Link>
        </div>

        {/* Desktop */}

        <div className="hidden overflow-x-auto md:block">
          {recentLoading ? (
            <div className="p-6 text-sm text-muted-foreground">
              Loading recent results...
            </div>
          ) : recentResults.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No recent results found.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="px-5 py-3 font-medium">User</th>

                  <th className="px-5 py-3 font-medium">Exam</th>

                  <th className="px-5 py-3 font-medium">Score</th>

                  <th className="px-5 py-3 font-medium">Percentage</th>

                  <th className="px-5 py-3 font-medium">Result</th>

                  <th className="px-5 py-3 font-medium">Submitted At</th>
                </tr>
              </thead>

              <tbody>
                {recentResults.map((item) => (
                  <tr key={item.attempt_id} className="border-b last:border-0">
                    <td className="px-5 py-4 font-medium">
                      {item.user_name || "---"}
                    </td>

                    <td className="px-5 py-4">{item.exam || "---"}</td>

                    <td className="px-5 py-4">
                      {item.score} / {item.out_of}
                    </td>

                    <td className="px-5 py-4">{item.percentage}%</td>

                    <td className="px-5 py-4">
                      <span
                        className={
                          item.result === "Pass"
                            ? "font-medium text-green-600"
                            : "font-medium text-red-500"
                        }
                      >
                        {item.result || "---"}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                      {item.submitted_at || "---"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Mobile */}

        <div className="space-y-3 p-4 md:hidden">
          {recentLoading ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Loading recent results...
            </div>
          ) : recentResults.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No recent results found.
            </div>
          ) : (
            recentResults.map((item) => (
              <div key={item.attempt_id} className="rounded-xl border p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-muted-foreground">
                      User
                    </p>

                    <p className="mt-1 break-words font-semibold">
                      {item.user_name || "---"}
                    </p>
                  </div>

                  <span
                    className={
                      item.result === "Pass"
                        ? "shrink-0 font-medium text-green-600"
                        : "shrink-0 font-medium text-red-500"
                    }
                  >
                    {item.result || "---"}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4">
                  <div className="col-span-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      Exam
                    </p>

                    <p className="mt-1 break-words text-sm">
                      {item.exam || "---"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Score
                    </p>

                    <p className="mt-1 text-sm">
                      {item.score} / {item.out_of}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Percentage
                    </p>

                    <p className="mt-1 text-sm">{item.percentage}%</p>
                  </div>

                  <div className="col-span-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      Submitted At
                    </p>

                    <p className="mt-1 break-words text-sm">
                      {item.submitted_at || "---"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default DashboardList;
