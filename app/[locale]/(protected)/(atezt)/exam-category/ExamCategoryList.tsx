"use client";

import React, { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";

import { DataTable } from "@/components/ui/tablereusable";

import CardReusable from "@/components/ui/CardReusable";

import { ColumnDef } from "@tanstack/react-table";

import { MoreVertical, Pencil, Plus, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import { Dialog } from "@/components/ui/dialog";

import dynamic from "next/dynamic";

import useReactQuery from "@/hooks/useReactQuery";

import useApiMutation from "@/hooks/Mutations/useApiMutation";

import { APICONSTANT } from "@/services/apiconfig";

import DeleteConfirmModal from "@/components/DeleteModal/DeleteConfirmModal";

import { RetryableError } from "@/components/ui/RetryableError";

/* =========================================================
   MODAL
========================================================= */

const ExamCategoryModal = dynamic(() => import("./ExamCategoryModal"), {
  ssr: false,
});

/* =========================================================
   TYPES
========================================================= */

export interface ExamCategory {
  id: number;

  exam: string;

  description: string;

  is_active: boolean;

  duration_minutes: number;

  total_marks: number;

  created_at: string;
}

interface ExamCategoryApiResponse {
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

  data: ExamCategory[];
}

/* =========================================================
   COMPONENT
========================================================= */

function ExamCategoryList() {
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
     GET API
  ======================================================= */

  const { data, isLoading, isError, refetch } =
    useReactQuery<ExamCategoryApiResponse>("GetExamCategories", queryString);

  /* =======================================================
     MODAL STATE
  ======================================================= */

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [modalMode, setModalMode] = useState<"add" | "edit">("add");

  const [selectedCategory, setSelectedCategory] = useState<ExamCategory | null>(
    null,
  );

  /* =======================================================
     DELETE
  ======================================================= */

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const deleteMutation = useApiMutation("delete");

  /* =======================================================
     API DATA
  ======================================================= */

  const categories = data?.data || [];

  const totalRecords = data?.total_records || 0;

  const totalPages = data?.total_pages || 1;

  /* =======================================================
     ADD
  ======================================================= */

  const handleAdd = () => {
    setModalMode("add");

    setSelectedCategory(null);

    setIsModalOpen(true);
  };

  /* =======================================================
     EDIT
  ======================================================= */

  const handleEdit = (category: ExamCategory) => {
    setModalMode("edit");

    setSelectedCategory(category);

    setIsModalOpen(true);
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
      const apiUrl = APICONSTANT.DeleteExamCategory.replace(
        "{category_id}",
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
      console.error("DELETE EXAM CATEGORY ERROR:", error);

      throw error;
    }
  };

  /* =======================================================
     DESKTOP TABLE COLUMNS
  ======================================================= */

  const columns = useMemo<ColumnDef<ExamCategory>[]>(
    () => [
      /* ==============================================
           EXAM
        ============================================== */

      {
        accessorKey: "exam",

        header: "Exam",

        cell: ({ row }) => (
          <div className="font-medium">{row.original.exam || "---"}</div>
        ),
      },

      /* ==============================================
           DESCRIPTION
        ============================================== */

      {
        accessorKey: "description",

        header: "Description",

        cell: ({ row }) => (
          <div className="max-w-[350px] truncate">
            {row.original.description || "---"}
          </div>
        ),
      },

      /* ==============================================
           DURATION
        ============================================== */

      {
        accessorKey: "duration_minutes",

        header: "Duration",

        cell: ({ row }) => <div>{row.original.duration_minutes ?? 0} Min</div>,
      },

      /* ==============================================
           TOTAL MARKS
        ============================================== */

      {
        accessorKey: "total_marks",

        header: "Total Marks",

        cell: ({ row }) => <div>{row.original.total_marks ?? 0}</div>,
      },

      /* ==============================================
           STATUS
        ============================================== */

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

      /* ==============================================
           CREATED
        ============================================== */

      {
        accessorKey: "created_at",

        header: "Created At",

        cell: ({ row }) => <div>{row.original.created_at || "---"}</div>,
      },

      /* ==============================================
           ACTIONS
        ============================================== */

      {
        id: "actions",

        header: "Actions",

        cell: ({ row }) => {
          const category = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEdit(category)}>
                  <Pencil className="h-4 w-4" />

                  <span className="px-2">Edit</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleDelete(category.id)}
                  className="text-red-500 focus:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />

                  <span className="px-2">Delete</span>
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
          message="Failed to load exam categories."
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
          Exam Categories
        </div>

        {/* SEARCH / PAGE SIZE / ADD */}

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
          {/* SEARCH */}

          <Input
            placeholder="Search exam categories..."
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
            <option value={10}>10 / page</option>

            <option value={20}>20 / page</option>

            <option value={50}>50 / page</option>

            <option value={100}>100 / page</option>
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
            data={categories}
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

        <div className="md:hidden w-full">
          <CardReusable<ExamCategory>
            data={categories}

            isLoading={isLoading}

            loadingCount={pageSize}

            getKey={(item) => item.id}

            /* ---------------------------------------------
               CARD FIELDS
            --------------------------------------------- */

            fields={[
              {
                key: "exam",

                label: "Exam",

                colSpan: 2,

                render: (item) => (
                  <span className="font-semibold">{item.exam || "---"}</span>
                ),
              },

              {
                key: "description",

                label: "Description",

                colSpan: 2,

                render: (item) => (
                  <p className="break-words leading-5">
                    {item.description || "---"}
                  </p>
                ),
              },

              {
                key: "duration",

                label: "Duration",

                colSpan: 1,

                render: (item) => `${item.duration_minutes ?? 0} Min`,
              },

              {
                key: "total_marks",

                label: "Total Marks",

                colSpan: 1,

                render: (item) => item.total_marks ?? 0,
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
                    {item.is_active ? "Active" : "Inactive"}
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

            /* ---------------------------------------------
               ACTIONS
            --------------------------------------------- */

            actions={(item) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEdit(item)}>
                    <Pencil className="h-4 w-4" />

                    <span className="px-2">Edit</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500 focus:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />

                    <span className="px-2">Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            /* ---------------------------------------------
               MOBILE PAGINATION
            --------------------------------------------- */

            page={page}

            pageSize={pageSize}

            totalPages={totalPages}

            totalRecords={totalRecords}

            onPageChange={setPage}
          />
        </div>
      </div>

      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <ExamCategoryModal
            mode={modalMode}

            category={selectedCategory || undefined}

            onClose={() => setIsModalOpen(false)}
          />
        </Dialog>
      )}

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

        title="Delete Exam Category"

        description="Are you sure you want to delete this exam category? This action cannot be undone."
      />
    </div>
  );
}

export default ExamCategoryList;
