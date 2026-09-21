"use client";

import React, { useMemo, useState } from "react";
import { MoreHorizontal, Search } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

import useReactQuery from "@/hooks/useReactQuery";

import { DataTable } from "@/components/ui/tablereusable";
import CardReusable from "@/components/ui/CardReusable";
import { RetryableError } from "@/components/ui/RetryableError";

import { Input } from "@/components/ui/input";

export interface ExamResult {
  attempt_id: number;
  attempt_number: number;

  user_id: number;
  user_name: string;

  exam_id: number;
  exam: string;
  exam_category: string;

  score: number;
  percentage: number;

  result: string;
  status: string;

  total_marks: number;
  obtained_marks: number;
  pass_mark: number;

  total_questions: number;
  attempted_questions: number;
  correct_answers: number;
  wrong_answers: number;

  started_at: string;
  submitted_at: string;
}

interface ResultsApiResponse {
  success: boolean;
  message: string;

  page: number;
  page_size: number;

  total_records: number;
  total_pages: number;

  has_next: boolean;
  has_previous: boolean;

  data: ExamResult[];
}

function ResultsList() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  /**
   * Server-side pagination + search
   */
  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    params.set("page", String(page));
    params.set("page_size", String(pageSize));

    if (search.trim()) {
      params.set("search", search.trim());
    }

    return `?${params.toString()}`;
  }, [page, pageSize, search]);

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useReactQuery<ResultsApiResponse>("GetResults", queryString);

  const results = response?.data ?? [];

  /**
   * Search
   */
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  };

  /**
   * Desktop columns
   */
  const columns = useMemo<ColumnDef<ExamResult>[]>(
    () => [
      {
        accessorKey: "user_name",
        header: "User",
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.original.user_name || "---"}</div>

            {/* <div className="text-xs text-muted-foreground">
              ID: {row.original.user_id}
            </div> */}
          </div>
        ),
      },

      {
        accessorKey: "exam",
        header: "Exam",
        cell: ({ row }) => (
          <div className="max-w-[220px]">
            <div className="break-words font-medium">
              {row.original.exam || "---"}
            </div>

            <div className="break-words text-xs text-muted-foreground">
              {row.original.exam_category || "---"}
            </div>
          </div>
        ),
      },

      {
        accessorKey: "attempt_number",
        header: "Attempt",
        cell: ({ row }) => <span>#{row.original.attempt_number}</span>,
      },

      {
        accessorKey: "score",
        header: "Score",
        cell: ({ row }) => (
          <div>
            <span className="font-medium">
              {row.original.obtained_marks}
              {" / "}
              {row.original.total_marks}
            </span>

            <div className="text-xs text-muted-foreground">
              {row.original.percentage}%
            </div>
          </div>
        ),
      },

      {
        accessorKey: "result",
        header: "Result",
        cell: ({ row }) => (
          <span
            className={
              row.original.result === "Passed"
                ? "font-medium text-green-600"
                : "font-medium text-red-500"
            }
          >
            {row.original.result || "---"}
          </span>
        ),
      },

      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <span
            className={
              row.original.status === "Completed"
                ? "font-medium text-green-600"
                : "font-medium text-orange-500"
            }
          >
            {row.original.status || "---"}
          </span>
        ),
      },

      {
        accessorKey: "attempted_questions",
        header: "Questions",
        cell: ({ row }) => (
          <div className="text-sm">
            <span className="font-medium">
              {row.original.attempted_questions}
            </span>
            {" / "}
            {row.original.total_questions}

            <div className="text-xs text-muted-foreground">
              Correct: {row.original.correct_answers}
              {" · "}
              Wrong: {row.original.wrong_answers}
            </div>
          </div>
        ),
      },

      {
        accessorKey: "submitted_at",
        header: "Submitted At",
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-sm">
            {row.original.submitted_at || "---"}
          </span>
        ),
      },
    ],
    [],
  );

  /**
   * Error
   */
  if (isError) {
    return (
      <RetryableError
        message="Failed to load results"
        onRetry={() => refetch()}
        isRetrying={isLoading}
      />
    );
  }

  return (
    <div className="w-full space-y-6 px-5 py-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Results</h1>

        <p className="text-sm text-muted-foreground">
          View exam attempts and results.
        </p>
      </div>

      {/* Search */}
      <div className="flex w-full">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={handleSearch}
            placeholder="Search user or exam..."
            className="pl-9"
          />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <DataTable
          columns={columns}
          data={results}
          isLoading={isLoading}
          page={response?.page ?? page}
          pageSize={response?.page_size ?? pageSize}
          totalPages={response?.total_pages ?? 1}
          totalRecords={response?.total_records ?? 0}
          onPageChange={setPage}
        />
      </div>

      {/* Mobile */}
      <div className="block md:hidden">
        <CardReusable<ExamResult>
          data={results}
          isLoading={isLoading}
          page={response?.page ?? page}
          pageSize={response?.page_size ?? pageSize}
          totalPages={response?.total_pages ?? 1}
          totalRecords={response?.total_records ?? 0}
          onPageChange={setPage}
          getKey={(item) => item.attempt_id}
          fields={[
            {
              key: "user",
              label: "User",
              colSpan: 2,
              render: (item) => (
                <div>
                  <div className="font-semibold">{item.user_name || "---"}</div>

                  <div className="text-xs text-muted-foreground">
                    User ID: {item.user_id}
                  </div>
                </div>
              ),
            },

            {
              key: "exam",
              label: "Exam",
              colSpan: 2,
              render: (item) => (
                <div>
                  <div className="font-medium">{item.exam || "---"}</div>

                  <div className="mt-1 break-words text-xs text-muted-foreground">
                    {item.exam_category || "---"}
                  </div>
                </div>
              ),
            },

            {
              key: "attempt",
              label: "Attempt",
              colSpan: 1,
              render: (item) => `#${item.attempt_number}`,
            },

            {
              key: "score",
              label: "Score",
              colSpan: 1,
              render: (item) => (
                <div>
                  <div className="font-medium">
                    {item.obtained_marks}
                    {" / "}
                    {item.total_marks}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {item.percentage}%
                  </div>
                </div>
              ),
            },

            {
              key: "result",
              label: "Result",
              colSpan: 1,
              render: (item) => (
                <span
                  className={
                    item.result === "Passed"
                      ? "font-medium text-green-600"
                      : "font-medium text-red-500"
                  }
                >
                  {item.result || "---"}
                </span>
              ),
            },

            {
              key: "status",
              label: "Status",
              colSpan: 1,
              render: (item) => (
                <span
                  className={
                    item.status === "Completed"
                      ? "font-medium text-green-600"
                      : "font-medium text-orange-500"
                  }
                >
                  {item.status || "---"}
                </span>
              ),
            },

            {
              key: "questions",
              label: "Questions",
              colSpan: 2,
              render: (item) => (
                <div>
                  <div>
                    Attempted: {item.attempted_questions}
                    {" / "}
                    {item.total_questions}
                  </div>

                  <div className="mt-1 text-xs text-muted-foreground">
                    Correct: {item.correct_answers}
                    {" · "}
                    Wrong: {item.wrong_answers}
                  </div>
                </div>
              ),
            },

            {
              key: "pass_mark",
              label: "Pass Mark",
              colSpan: 1,
              render: (item) => item.pass_mark ?? 0,
            },

            {
              key: "submitted_at",
              label: "Submitted At",
              colSpan: 2,
              render: (item) => (
                <span className="break-words">
                  {item.submitted_at || "---"}
                </span>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}

export default ResultsList;
