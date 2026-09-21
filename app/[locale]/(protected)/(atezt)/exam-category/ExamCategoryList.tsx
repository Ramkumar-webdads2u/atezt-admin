"use client";

import React, { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/tablereusable";
import { ColumnDef } from "@tanstack/react-table";

import {
  MoreVertical,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

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

import { useQueryClient } from "@tanstack/react-query";

import DeleteConfirmModal from "@/components/DeleteModal/DeleteConfirmModal";
import { RetryableError } from "@/components/ui/RetryableError";

const ExamCategoryModal = dynamic(
  () => import("./ExamCategoryModal"),
  {
    ssr: false,
  }
);

export interface ExamCategory {
  id: number;
  exam: string;
  description: string;
  is_active: boolean;

  // GET API still returns these
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

  total_records: number;

  data: ExamCategory[];
}

function ExamCategoryList() {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useReactQuery<ExamCategoryApiResponse>(
    "GetExamCategories"
  );

  const [filterValue, setFilterValue] = useState("");

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [modalMode, setModalMode] =
    useState<"add" | "edit">("add");

  const [selectedCategory, setSelectedCategory] =
    useState<ExamCategory | null>(null);

  const [deleteId, setDeleteId] =
    useState<number | null>(null);

  // DELETE mutation
  const deleteMutation =
    useApiMutation("delete");

  const categories =
    data?.data || [];

  /* =====================================================
     SEARCH
  ===================================================== */

  const filteredData = useMemo(() => {
    const search =
      filterValue.trim().toLowerCase();

    if (!search) {
      return categories;
    }

    return categories.filter((item) => {
      return (
        item.exam
          ?.toLowerCase()
          .includes(search) ||
        item.description
          ?.toLowerCase()
          .includes(search)
      );
    });
  }, [categories, filterValue]);

  /* =====================================================
     ADD
  ===================================================== */

  const handleAdd = () => {
    setModalMode("add");
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  /* =====================================================
     EDIT
  ===================================================== */

  const handleEdit = (
    category: ExamCategory
  ) => {
    setModalMode("edit");
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  /* =====================================================
     DELETE - OPEN MODAL
  ===================================================== */

  const handleDelete = (id: number) => {
    console.log(
      "🗑️ DELETE CATEGORY ID:",
      id
    );

    setDeleteId(id);
  };

  /* =====================================================
     DELETE - API
  ===================================================== */

  const confirmDelete = async () => {
  if (deleteId === null) {
    return;
  }

  const id = deleteId;

  try {
    const apiUrl =
      APICONSTANT.DeleteExamCategory.replace(
        "{category_id}",
        String(id)
      );

    console.log("🗑️ DELETE API:", apiUrl);

    const response =
      await deleteMutation.mutateAsync({
        url: {
          apiUrl,
        },
      });

    console.log("🗑️ DELETE RESPONSE:", response);

    // API success
    if (!response?.error) {
      console.log(
        "✅ Delete successful. Fetching categories again..."
      );

      // Close delete modal
      setDeleteId(null);

      // Explicitly call GET API again
      await refetch();

      console.log(
        "✅ Exam categories refreshed"
      );
    }
  } catch (error) {
    console.error(
      "❌ DELETE EXAM CATEGORY ERROR:",
      error
    );

    throw error;
  }
};

  /* =====================================================
     TABLE COLUMNS
  ===================================================== */

  const columns =
    useMemo<ColumnDef<ExamCategory>[]>(
      () => [
        {
          accessorKey: "exam",
          header: "Exam",

          cell: ({ row }) => (
            <div className="font-medium">
              {row.original.exam || "---"}
            </div>
          ),
        },

        {
          accessorKey: "description",
          header: "Description",

          cell: ({ row }) => (
            <div className="max-w-[350px] truncate">
              {row.original.description ||
                "---"}
            </div>
          ),
        },

        {
          accessorKey: "duration_minutes",
          header: "Duration",

          cell: ({ row }) => (
            <div>
              {row.original.duration_minutes ??
                0}{" "}
              Min
            </div>
          ),
        },

        {
          accessorKey: "total_marks",
          header: "Total Marks",

          cell: ({ row }) => (
            <div>
              {row.original.total_marks ?? 0}
            </div>
          ),
        },

        {
          accessorKey: "is_active",
          header: "Status",

          cell: ({ row }) => {
            const active =
              row.original.is_active;

            return (
              <span
                className={
                  active
                    ? "inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
                    : "inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700"
                }
              >
                {active
                  ? "Active"
                  : "Inactive"}
              </span>
            );
          },
        },

        {
          accessorKey: "created_at",
          header: "Created At",

          cell: ({ row }) => (
            <div>
              {row.original.created_at ||
                "---"}
            </div>
          ),
        },

        {
          id: "actions",
          header: "Actions",

          cell: ({ row }) => {
            const category =
              row.original;

            return (
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                >
                  <DropdownMenuItem
                    onClick={() =>
                      handleEdit(category)
                    }
                  >
                    <Pencil className="h-4 w-4" />

                    <span className="px-2">
                      Edit
                    </span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() =>
                      handleDelete(
                        category.id
                      )
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
            );
          },
        },
      ],
      []
    );

  /* =====================================================
     ERROR
  ===================================================== */

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

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="w-full">

      <div className="flex flex-col items-start justify-between gap-3 px-5 py-4 sm:flex-row sm:items-center sm:gap-4">

        <div className="flex-1 text-xl font-medium text-default-900">
          Exam Categories
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">

          <Input
            placeholder="Search exam categories..."
            value={filterValue}
            onChange={(event) =>
              setFilterValue(
                event.target.value
              )
            }
            className="w-full sm:w-[280px]"
          />

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

      <div className="p-4">
        <DataTable
          columns={columns}
          data={filteredData}
          isLoading={isLoading}
        />
      </div>

      {/* ADD / EDIT */}
      {isModalOpen && (
        <Dialog
          open={isModalOpen}
          onOpenChange={
            setIsModalOpen
          }
        >
          <ExamCategoryModal
            mode={modalMode}
            category={
              selectedCategory ||
              undefined
            }
            onClose={() =>
              setIsModalOpen(false)
            }
          />
        </Dialog>
      )}

      {/* DELETE */}
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