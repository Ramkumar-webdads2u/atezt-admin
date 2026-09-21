"use client";

import React from "react";
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
  year: number;
  label: string;
  users?: number;
  revenue?: number;
}

interface DashboardResponse {
  year: number;
  period: string;

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

function DashboardList() {
  const {
    data: dashboardResponse,
    isLoading: dashboardLoading,
    isError: dashboardError,
    refetch: refetchDashboard,
  } = useReactQuery<DashboardResponse>("Dashboard");

  const {
    data: recentResponse,
    isLoading: recentLoading,
    isError: recentError,
    refetch: refetchRecentResults,
  } = useReactQuery<RecentResultsResponse>("RecentResults");

  const isLoading = dashboardLoading || recentLoading;

  const isError = dashboardError || recentError;

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

  return (
    <div className="w-full space-y-6 px-5 py-4">
      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

        <p className="text-sm text-muted-foreground">
          Overview of users, revenue and exam activity.
        </p>
      </div>

      {/* ========================= */}
      {/* SUMMARY CARDS */}
      {/* ========================= */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Total Users */}
        <div className="rounded-xl border bg-background p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>

              <p className="mt-2 text-2xl font-semibold">
                {isLoading ? "..." : (dashboard?.users?.total ?? 0)}
              </p>
            </div>

            <div className="rounded-lg bg-muted p-2">
              <Users className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Active Users */}
        <div className="rounded-xl border bg-background p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Users</p>

              <p className="mt-2 text-2xl font-semibold">
                {isLoading ? "..." : (dashboard?.users?.active ?? 0)}
              </p>
            </div>

            <div className="rounded-lg bg-muted p-2">
              <UserCheck className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Inactive Users */}
        <div className="rounded-xl border bg-background p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Inactive Users</p>

              <p className="mt-2 text-2xl font-semibold">
                {isLoading ? "..." : (dashboard?.users?.inactive ?? 0)}
              </p>
            </div>

            <div className="rounded-lg bg-muted p-2">
              <UserX className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="rounded-xl border bg-background p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>

              <p className="mt-2 text-2xl font-semibold">
                {isLoading
                  ? "..."
                  : `${dashboard?.revenue?.currency === "INR" ? "₹" : ""}${dashboard?.revenue?.total ?? 0}`}
              </p>
            </div>

            <div className="rounded-lg bg-muted p-2">
              <IndianRupee className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* ========================= */}
      {/* EXAM SUMMARY */}
      {/* ========================= */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Categories */}
        <div className="rounded-xl border bg-background p-5">
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
        </div>

        {/* Exams */}
        <div className="rounded-xl border bg-background p-5">
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
        </div>

        {/* Exam Per User */}
        <div className="rounded-xl border bg-background p-5">
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
        </div>
      </div>

      {/* ========================= */}
      {/* YEARLY CHARTS */}
      {/* ========================= */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Users Chart */}
        <div className="rounded-xl border bg-background p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Users</h2>

              <p className="text-sm text-muted-foreground">
                Yearly user overview
              </p>
            </div>

            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </div>

          <div className="mt-6 space-y-4">
            {usersChart.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No user chart data available.
              </div>
            ) : (
              usersChart.map((item) => (
                <div key={item.year} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.label}</span>

                    <span className="text-muted-foreground">
                      {item.users ?? 0} users
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{
                        width: `${Math.min(
                          100,
                          ((item.users ?? 0) /
                            Math.max(dashboard?.users?.total ?? 1, 1)) *
                            100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="rounded-xl border bg-background p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Revenue</h2>

              <p className="text-sm text-muted-foreground">
                Yearly revenue overview
              </p>
            </div>

            <IndianRupee className="h-5 w-5 text-muted-foreground" />
          </div>

          <div className="mt-6 space-y-4">
            {revenueChart.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No revenue chart data available.
              </div>
            ) : (
              revenueChart.map((item) => (
                <div key={item.year} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.label}</span>

                    <span className="text-muted-foreground">
                      ₹{item.revenue ?? 0}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{
                        width: `${Math.min(
                          100,
                          ((item.revenue ?? 0) /
                            Math.max(dashboard?.revenue?.total ?? 1, 1)) *
                            100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ========================= */}
      {/* RECENT RESULTS */}
      {/* ========================= */}
      <div className="rounded-xl border bg-background">
        <div className="border-b px-5 py-4">
          <h2 className="font-semibold">Recent Results</h2>

          <p className="text-sm text-muted-foreground">
            Latest exam attempts and results.
          </p>
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
      </div>
    </div>
  );
}

export default DashboardList;
