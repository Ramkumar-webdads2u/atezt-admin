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

const QuestionTypeModal = dynamic(() => import("./QuestionTypeModal"), {
  ssr: false,
});

/* =========================================================
   TYPES
========================================================= */

export interface QuestionType {
  id: number;

  question_type: string;

  options: number;

  is_active: boolean;

  created_at: string;

  updated_at: string;
}

interface QuestionTypeApiResponse {
  success: boolean;

  message: string;

  data: {
    counts: {
      total: number;

      active: number;

      inactive: number;
    };

    total_records: number;

    data: QuestionType[];
  };
}

/* =========================================================
   COMPONENT
========================================================= */

function QuestionTypeList() {
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
     GET QUESTION TYPES
  ======================================================= */

  const { data, isLoading, isError, refetch } =
    useReactQuery<QuestionTypeApiResponse>("GetQuestionTypes");

  /* =======================================================
     MODAL STATE
  ======================================================= */

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [modalMode, setModalMode] = useState<"add" | "edit">("add");

  const [selectedQuestionType, setSelectedQuestionType] =
    useState<QuestionType | null>(null);

  /* =======================================================
     DELETE
  ======================================================= */

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const deleteMutation = useApiMutation("delete");

  /* =======================================================
     API DATA
  ======================================================= */

  const questionTypes = data?.data?.data || [];

  const totalRecords = data?.data?.total_records || questionTypes.length;

  /* =======================================================
     SEARCH
  ======================================================= */

  const filteredQuestionTypes = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return questionTypes;
    }

    return questionTypes.filter((item) =>
      item.question_type.toLowerCase().includes(value),
    );
  }, [questionTypes, search]);

  /* =======================================================
     CLIENT PAGINATION
  ======================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredQuestionTypes.length / pageSize),
  );

  /*
   * Make sure page doesn't stay
   * outside the available pages
   * after search/delete.
   */

  const safePage = Math.min(page, totalPages);

  const paginatedQuestionTypes = useMemo(() => {
    const start = (safePage - 1) * pageSize;

    const end = start + pageSize;

    return filteredQuestionTypes.slice(start, end);
  }, [filteredQuestionTypes, safePage, pageSize]);

  /* =======================================================
     SEARCH / PAGE COUNT
  ======================================================= */

  const displayTotalRecords = filteredQuestionTypes.length;

  /* =======================================================
     ADD
  ======================================================= */

  const handleAdd = () => {
    setModalMode("add");

    setSelectedQuestionType(null);

    setIsModalOpen(true);
  };

  /* =======================================================
     EDIT
  ======================================================= */

  const handleEdit = (questionType: QuestionType) => {
    setModalMode("edit");

    setSelectedQuestionType(questionType);

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
      const apiUrl = APICONSTANT.DeleteQuestionType.replace(
        "{question_type_id}",
        String(id),
      );

      const response = await deleteMutation.mutateAsync({
        url: {
          apiUrl,
        },
      });

      console.log("DELETE QUESTION TYPE RESPONSE:", response);

      if (response?.success === true) {
        setDeleteId(null);

        await refetch();
      }
    } catch (error) {
      console.error("DELETE QUESTION TYPE ERROR:", error);

      throw error;
    }
  };

  /* =======================================================
     TABLE COLUMNS
  ======================================================= */

  const columns = useMemo<ColumnDef<QuestionType>[]>(
    () => [
      /* ==============================================
           QUESTION TYPE
        ============================================== */

      {
        accessorKey: "question_type",

        header: "Question Type",

        cell: ({ row }) => (
          <div className="font-medium">
            {row.original.question_type || "---"}
          </div>
        ),
      },

      /* ==============================================
           OPTIONS
        ============================================== */

      {
        accessorKey: "options",

        header: "Options",

        cell: ({ row }) => <div>{row.original.options ?? 0}</div>,
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
           CREATED AT
        ============================================== */

      {
        accessorKey: "created_at",

        header: "Created At",

        cell: ({ row }) => <div>{row.original.created_at || "---"}</div>,
      },

      /* ==============================================
           UPDATED AT
        ============================================== */

      {
        accessorKey: "updated_at",

        header: "Updated At",

        cell: ({ row }) => <div>{row.original.updated_at || "---"}</div>,
      },

      /* ==============================================
           ACTIONS
        ============================================== */

      {
        id: "actions",

        header: "Actions",

        cell: ({ row }) => {
          const questionType = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                {/* EDIT */}

                <DropdownMenuItem onClick={() => handleEdit(questionType)}>
                  <Pencil className="h-4 w-4" />

                  <span className="px-2">Edit</span>
                </DropdownMenuItem>

                {/* DELETE */}

                <DropdownMenuItem
                  onClick={() => handleDelete(questionType.id)}
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
          message="Failed to load question types."
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
          Question Types
        </div>

        {/* SEARCH / PAGE SIZE / ADD */}

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
          {/* SEARCH */}

          <Input
            placeholder="Search question types..."
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
            data={paginatedQuestionTypes}
            isLoading={isLoading}
            page={safePage}
            pageSize={pageSize}
            totalPages={totalPages}
            totalRecords={displayTotalRecords}
            onPageChange={setPage}
          />
        </div>

        {/* =================================================
            MOBILE CARDS
        ================================================= */}

        <div className="w-full md:hidden">
          <CardReusable<QuestionType>
            data={paginatedQuestionTypes}

            isLoading={isLoading}

            loadingCount={5}

            getKey={(item) => item.id}

            /* ---------------------------------------------
               CARD FIELDS
            --------------------------------------------- */

            fields={[
              {
                key: "question_type",

                label: "Question Type",

                colSpan: 2,

                render: (item) => (
                  <span className="font-semibold">
                    {item.question_type || "---"}
                  </span>
                ),
              },

              {
                key: "options",

                label: "Options",

                colSpan: 1,

                render: (item) => item.options ?? 0,
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

              {
                key: "updated_at",

                label: "Updated At",

                colSpan: 2,

                render: (item) => (
                  <span className="break-words">
                    {item.updated_at || "---"}
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

            page={safePage}

            pageSize={pageSize}

            totalPages={totalPages}

            totalRecords={displayTotalRecords}

            onPageChange={setPage}
          />
        </div>
      </div>

      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <QuestionTypeModal
            mode={modalMode}

            questionType={selectedQuestionType || undefined}

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

        title="Delete Question Type"

        description="Are you sure you want to delete this question type? This action cannot be undone."
      />
    </div>
  );
}

export default QuestionTypeList;
