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

const CouponModal = dynamic(() => import("./CouponModal"), {
  ssr: false,
});

/* =========================================================
   TYPES
========================================================= */

export interface Coupon {
  id: number;

  coupon_name: string;

  coupon_code: string;

  description: string;

  percentage: number;

  valid_from: string;

  valid_until: string;

  is_active: boolean;

  usage_limit: number;

  used_count: number;

  created_at: string;
}

interface CouponApiResponse {
  success: boolean;

  message: string;

  counts: {
    total: number;

    active: number;

    inactive: number;
  };

  total_records: number;

  data: Coupon[];
}

/* =========================================================
   COMPONENT
========================================================= */

function CouponList() {
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
     GET COUPONS
  ======================================================= */

  const { data, isLoading, isError, refetch } =
    useReactQuery<CouponApiResponse>("GetCoupons");

  /* =======================================================
     MODAL STATE
  ======================================================= */

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [modalMode, setModalMode] = useState<"add" | "edit">("add");

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  /* =======================================================
     DELETE
  ======================================================= */

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const deleteMutation = useApiMutation("delete");

  /* =======================================================
     API DATA
  ======================================================= */

  const coupons = data?.data || [];

  /* =======================================================
     SEARCH
  ======================================================= */

  const filteredCoupons = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return coupons;
    }

    return coupons.filter(
      (coupon) =>
        coupon.coupon_name.toLowerCase().includes(value) ||
        coupon.coupon_code.toLowerCase().includes(value) ||
        coupon.description.toLowerCase().includes(value),
    );
  }, [coupons, search]);

  /* =======================================================
     CLIENT PAGINATION
  ======================================================= */

  const totalPages = Math.max(1, Math.ceil(filteredCoupons.length / pageSize));

  const safePage = Math.min(page, totalPages);

  const paginatedCoupons = useMemo(() => {
    const start = (safePage - 1) * pageSize;

    const end = start + pageSize;

    return filteredCoupons.slice(start, end);
  }, [filteredCoupons, safePage, pageSize]);

  const displayTotalRecords = filteredCoupons.length;

  /* =======================================================
     ADD
  ======================================================= */

  const handleAdd = () => {
    setModalMode("add");

    setSelectedCoupon(null);

    setIsModalOpen(true);
  };

  /* =======================================================
     EDIT
  ======================================================= */

  const handleEdit = (coupon: Coupon) => {
    setModalMode("edit");

    setSelectedCoupon(coupon);

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
      const apiUrl = APICONSTANT.DeleteCoupon.replace(
        "{coupon_id}",
        String(id),
      );

      const response = await deleteMutation.mutateAsync({
        url: {
          apiUrl,
        },
      });

      console.log("DELETE COUPON RESPONSE:", response);

      if (response?.success === true) {
        setDeleteId(null);

        await refetch();
      }
    } catch (error) {
      console.error("DELETE COUPON ERROR:", error);

      throw error;
    }
  };

  /* =======================================================
     TABLE COLUMNS
  ======================================================= */

  const columns = useMemo<ColumnDef<Coupon>[]>(
    () => [
      /* ==============================================
           COUPON NAME
        ============================================== */

      {
        accessorKey: "coupon_name",

        header: "Coupon Name",

        cell: ({ row }) => (
          <div className="font-medium">{row.original.coupon_name || "---"}</div>
        ),
      },

      /* ==============================================
           COUPON CODE
        ============================================== */

      {
        accessorKey: "coupon_code",

        header: "Coupon Code",

        cell: ({ row }) => (
          <span className="font-medium">
            {row.original.coupon_code || "---"}
          </span>
        ),
      },

      /* ==============================================
           PERCENTAGE
        ============================================== */

      {
        accessorKey: "percentage",

        header: "Percentage",

        cell: ({ row }) => <div>{row.original.percentage ?? 0}%</div>,
      },

      /* ==============================================
           USAGE
        ============================================== */

      {
        accessorKey: "usage_limit",

        header: "Usage",

        cell: ({ row }) => (
          <div>
            {row.original.used_count ?? 0}
            {" / "}
            {row.original.usage_limit ?? 0}
          </div>
        ),
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
           VALID FROM
        ============================================== */

      {
        accessorKey: "valid_from",

        header: "Valid From",

        cell: ({ row }) => <div>{row.original.valid_from || "---"}</div>,
      },

      /* ==============================================
           VALID UNTIL
        ============================================== */

      {
        accessorKey: "valid_until",

        header: "Valid Until",

        cell: ({ row }) => <div>{row.original.valid_until || "---"}</div>,
      },

      /* ==============================================
           ACTIONS
        ============================================== */

      {
        id: "actions",

        header: "Actions",

        cell: ({ row }) => {
          const coupon = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEdit(coupon)}>
                  <Pencil className="h-4 w-4" />

                  <span className="px-2">Edit</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => handleDelete(coupon.id)}
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
          message="Failed to load coupons."
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
          Coupons
        </div>

        {/* SEARCH / PAGE SIZE / ADD */}

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
          {/* SEARCH */}

          <Input
            placeholder="Search coupons..."
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
            DESKTOP
        ================================================= */}

        <div className="hidden md:block">
          <DataTable
            columns={columns}
            data={paginatedCoupons}
            isLoading={isLoading}
            page={safePage}
            pageSize={pageSize}
            totalPages={totalPages}
            totalRecords={displayTotalRecords}
            onPageChange={setPage}
          />
        </div>

        {/* =================================================
            MOBILE
        ================================================= */}

        <div className="w-full md:hidden">
          <CardReusable<Coupon>
            data={paginatedCoupons}

            isLoading={isLoading}

            loadingCount={5}

            getKey={(item) => item.id}

            /* ---------------------------------------------
               CARD FIELDS
            --------------------------------------------- */

            fields={[
              {
                key: "coupon_name",

                label: "Coupon Name",

                colSpan: 2,

                render: (item) => (
                  <span className="font-semibold">
                    {item.coupon_name || "---"}
                  </span>
                ),
              },

              {
                key: "coupon_code",

                label: "Coupon Code",

                colSpan: 1,

                render: (item) => (
                  <span className="font-medium">
                    {item.coupon_code || "---"}
                  </span>
                ),
              },

              {
                key: "percentage",

                label: "Percentage",

                colSpan: 1,

                render: (item) => `${item.percentage ?? 0}%`,
              },

              {
                key: "usage",

                label: "Usage",

                colSpan: 1,

                render: (item) =>
                  `${item.used_count ?? 0} / ${item.usage_limit ?? 0}`,
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
                key: "valid_from",

                label: "Valid From",

                colSpan: 2,

                render: (item) => (
                  <span className="break-words">
                    {item.valid_from || "---"}
                  </span>
                ),
              },

              {
                key: "valid_until",

                label: "Valid Until",

                colSpan: 2,

                render: (item) => (
                  <span className="break-words">
                    {item.valid_until || "---"}
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
               PAGINATION
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
          <CouponModal
            mode={modalMode}

            coupon={selectedCoupon || undefined}

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

        title="Delete Coupon"

        description="Are you sure you want to delete this coupon? This action cannot be undone."
      />
    </div>
  );
}

export default CouponList;
