"use client";

import React, { useMemo, useState } from "react";
import { MoreVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/tablereusable";
import CardReusable from "@/components/ui/CardReusable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import useReactQuery from "@/hooks/useReactQuery";
import useApiMutation from "@/hooks/Mutations/useApiMutation";

import { APICONSTANT } from "@/services/apiconfig";

import DeleteConfirmModal from "@/components/DeleteModal/DeleteConfirmModal";
import { RetryableError } from "@/components/ui/RetryableError";

/* =========================================================
   TYPES
========================================================= */

export interface Exam {
  id: number;
  exam_name: string;
  category: string;
  total_questions: number;
  price: number;
  duration_minutes: number;
  total_marks: number;
  is_active: boolean;
  created_at: string;
}

interface ExamApiResponse {
  success: boolean;
  message: string;

  counts: {
    total: number;
    active: number;
    inactive: number;
  };

  page: number;
  page_size: number;
  total_records: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;

  data: Exam[];
}

/* =========================================================
   COMPONENT
========================================================= */

function ExamsList() {
  const router = useRouter();

  /* =======================================================
     PAGINATION
  ======================================================= */

  const [page, setPage] = useState(1);

  const [pageSize, setPageSize] = useState(10);

  /* =======================================================
     SEARCH
  ======================================================= */

  const [search, setSearch] = useState("");

  /* =======================================================
     QUERY STRING
  ======================================================= */

  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    params.set("page", String(page));

    params.set("page_size", String(pageSize));

    if (search.trim()) {
      params.set("search", search.trim());
    }

    return `?${params.toString()}`;
  }, [page, pageSize, search]);

  /* =======================================================
     GET EXAMS
  ======================================================= */

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useReactQuery<ExamApiResponse>(
    "GetExams",
    queryString,
  );

  /* =======================================================
     DELETE
  ======================================================= */

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const deleteMutation = useApiMutation("delete");

  /* =======================================================
     API DATA
  ======================================================= */

  const exams = data?.data || [];

  const totalRecords = data?.total_records || 0;

  const totalPages = data?.total_pages || 1;

  /* =======================================================
     ADD
  ======================================================= */

  const handleAdd = () => {
    router.push("exams/create");
  };

  /* =======================================================
     EDIT
  ======================================================= */

  const handleEdit = (exam: Exam) => {
    router.push(`exams/${exam.id}/edit`);
  };

  /* =======================================================
     DELETE - OPEN
  ======================================================= */

  const handleDelete = (id: number) => {
    setDeleteId(id);
  };

  /* =======================================================
     DELETE - API
  ======================================================= */

  const confirmDelete = async () => {
    if (deleteId === null) {
      return;
    }

    const id = deleteId;

    try {
      const apiUrl = APICONSTANT.DeleteExam.replace(
        "{exam_id}",
        String(id),
      );

      const response = await deleteMutation.mutateAsync({
        url: {
          apiUrl,
        },
      });

      if (response?.success === true) {
        setDeleteId(null);

        await refetch();
      }
    } catch (error) {
      console.error("DELETE EXAM ERROR:", error);

      throw error;
    }
  };

  /* =======================================================
     DESKTOP TABLE COLUMNS
  ======================================================= */

  const columns = useMemo<ColumnDef<Exam>[]>(
    () => [
      /* =====================================================
         EXAM
      ===================================================== */

      {
        accessorKey: "exam_name",

        header: "Exam",

        cell: ({ row }) => (
          <div className="min-w-[220px] font-medium">
            {row.original.exam_name || "---"}
          </div>
        ),
      },

      /* =====================================================
         CATEGORY
      ===================================================== */

      {
        accessorKey: "category",

        header: "Category",

        cell: ({ row }) => (
          <div className="max-w-[200px] truncate">
            {row.original.category || "---"}
          </div>
        ),
      },

      /* =====================================================
         QUESTIONS
      ===================================================== */

      {
        accessorKey: "total_questions",

        header: "Questions",

        cell: ({ row }) => (
          <div>{row.original.total_questions ?? 0}</div>
        ),
      },

      /* =====================================================
         PRICE
      ===================================================== */

      {
        accessorKey: "price",

        header: "Price",

        cell: ({ row }) => (
          <div>₹{row.original.price ?? 0}</div>
        ),
      },

      /* =====================================================
         DURATION
      ===================================================== */

      {
        accessorKey: "duration_minutes",

        header: "Duration",

        cell: ({ row }) => (
          <div>
            {row.original.duration_minutes ?? 0} Min
          </div>
        ),
      },

      /* =====================================================
         TOTAL MARKS
      ===================================================== */

      {
        accessorKey: "total_marks",

        header: "Total Marks",

        cell: ({ row }) => (
          <div>{row.original.total_marks ?? 0}</div>
        ),
      },

      /* =====================================================
         STATUS
      ===================================================== */

      {
        accessorKey: "is_active",

        header: "Status",

        cell: ({ row }) => {
          const active = row.original.is_active;

          return (
            <span
              className={
                active
                  ? "inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
                  : "inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700"
              }
            >
              {active ? "Active" : "Inactive"}
            </span>
          );
        },
      },

      /* =====================================================
         CREATED
      ===================================================== */

      {
        accessorKey: "created_at",

        header: "Created At",

        cell: ({ row }) => (
          <div className="whitespace-nowrap">
            {row.original.created_at || "---"}
          </div>
        ),
      },

      /* =====================================================
         ACTIONS
      ===================================================== */

      {
        id: "actions",

        header: "Actions",

        cell: ({ row }) => {
          const exam = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => handleEdit(exam)}
                >
                  <Pencil className="h-4 w-4" />

                  <span className="px-2">
                    Edit
                  </span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleDelete(exam.id)}
                  className="text-red-500 focus:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />

                  <span className="px-2">
                    Delete
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [],
  );

  /* =======================================================
     ERROR
  ======================================================= */

  if (isError) {
    return (
      <div className="p-4">
        <RetryableError
          message="Failed to load exams."
          onRetry={() => refetch()}
          isRetrying={isLoading}
        />
      </div>
    );
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="w-full">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col items-start justify-between gap-3 px-5 py-4 sm:flex-row sm:items-center sm:gap-4">
        {/* TITLE */}

        <div className="flex-1 text-xl font-medium text-default-900">
          Exams
        </div>

        {/* SEARCH / PAGE SIZE / ADD */}

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
          {/* SEARCH */}

          <Input
            placeholder="Search exams..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);

              setPage(1);
            }}
            className="w-full sm:w-[280px]"
          />

          {/* PAGE SIZE */}

          <select
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));

              setPage(1);
            }}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value={10}>
              10 / page
            </option>

            <option value={20}>
              20 / page
            </option>

            <option value={50}>
              50 / page
            </option>

            <option value={100}>
              100 / page
            </option>
          </select>

          {/* ADD */}

          <Button
            variant="outline"
            size="md"
            className="w-full gap-2 sm:w-auto"
            onClick={handleAdd}
          >
            <Plus size={18} />

            Add
          </Button>
        </div>
      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="p-4">
        {/* =================================================
            DESKTOP TABLE
        ================================================= */}

        <div className="hidden md:block">
          <DataTable
            columns={columns}
            data={exams}
            isLoading={isLoading}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            totalRecords={totalRecords}
            onPageChange={setPage}
          />
        </div>

        {/* =================================================
            MOBILE CARDS
        ================================================= */}

        <div className="w-full md:hidden">
          <CardReusable<Exam>
            data={exams}
            isLoading={isLoading}
            loadingCount={pageSize}
            getKey={(item) => item.id}
            fields={[
              {
                key: "exam_name",

                label: "Exam",

                colSpan: 2,

                render: (item) => (
                  <span className="font-semibold">
                    {item.exam_name || "---"}
                  </span>
                ),
              },

              {
                key: "category",

                label: "Category",

                colSpan: 2,

                render: (item) => (
                  <span className="break-words">
                    {item.category || "---"}
                  </span>
                ),
              },

              {
                key: "total_questions",

                label: "Questions",

                colSpan: 1,

                render: (item) =>
                  item.total_questions ?? 0,
              },

              {
                key: "price",

                label: "Price",

                colSpan: 1,

                render: (item) =>
                  `₹${item.price ?? 0}`,
              },

              {
                key: "duration_minutes",

                label: "Duration",

                colSpan: 1,

                render: (item) =>
                  `${item.duration_minutes ?? 0} Min`,
              },

              {
                key: "total_marks",

                label: "Total Marks",

                colSpan: 1,

                render: (item) =>
                  item.total_marks ?? 0,
              },

              {
                key: "status",

                label: "Status",

                colSpan: 1,

                render: (item) => (
                  <span
                    className={
                      item.is_active
                        ? "font-medium text-green-600"
                        : "font-medium text-red-500"
                    }
                  >
                    {item.is_active
                      ? "Active"
                      : "Inactive"}
                  </span>
                ),
              },

              {
                key: "created_at",

                label: "Created At",

                colSpan: 2,

                render: (item) => (
                  <span className="break-words">
                    {item.created_at || "---"}
                  </span>
                ),
              },
            ]}
            actions={(item) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => handleEdit(item)}
                  >
                    <Pencil className="h-4 w-4" />

                    <span className="px-2">
                      Edit
                    </span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() =>
                      handleDelete(item.id)
                    }
                    className="text-red-500 focus:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />

                    <span className="px-2">
                      Delete
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            page={page}
            pageSize={pageSize}
            totalPages={totalPages}
            totalRecords={totalRecords}
            onPageChange={setPage}
          />
        </div>
      </div>

      {/* =================================================
          DELETE MODAL
      ================================================= */}

      <DeleteConfirmModal
        open={deleteId !== null}
        onClose={() => {
          if (!deleteMutation.isPending) {
            setDeleteId(null);
          }
        }}
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
        title="Delete Exam"
        description="Are you sure you want to delete this exam? This action cannot be undone."
      />
    </div>
  );
}

export default ExamsList;