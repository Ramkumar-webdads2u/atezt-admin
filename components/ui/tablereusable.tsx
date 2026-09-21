"use client";

import React from "react";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface DataTableProps<TData> {
  columns: any[];
  data: TData[];

  enableSorting?: boolean;

  isLoading?: boolean;

  /*
   * Server-side pagination
   */
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;

  /*
   * Optional page size
   */
  pageSize?: number;
  totalRecords?: number;
}

export function DataTable<TData>({
  columns,
  data,

  enableSorting = true,

  isLoading = false,

  page = 1,
  totalPages = 1,
  onPageChange,

  pageSize = 10,
  totalRecords = 0,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,

    getCoreRowModel: getCoreRowModel(),

    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,

    /*
     * IMPORTANT:
     *
     * Do NOT use getPaginationRowModel()
     * here because pagination is handled
     * by the backend.
     */
    manualPagination: true,

    manualSorting: false,
  });

  /*
   * Calculate current range
   */
  const startRecord = totalRecords === 0 ? 0 : (page - 1) * pageSize + 1;

  const endRecord = Math.min(page * pageSize, totalRecords);

  /*
   * Previous
   */
  const handlePrevious = () => {
    if (isLoading || page <= 1) {
      return;
    }

    onPageChange?.(page - 1);
  };

  /*
   * Next
   */
  const handleNext = () => {
    if (isLoading || page >= totalPages) {
      return;
    }

    onPageChange?.(page + 1);
  };

  return (
    <div className="w-full space-y-4">
      {/* =================================================
          TABLE
      ================================================= */}

      <div className="w-full overflow-x-auto">
        <Table>
          {/* =============================================
              HEADER
          ============================================= */}

          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          {/* =============================================
              BODY
          ============================================= */}

          <TableBody>
            {/* -----------------------------------------
                LOADING
            ----------------------------------------- */}

            {isLoading ? (
              Array.from({
                length: pageSize,
              }).map((_, rowIndex) => (
                <TableRow key={`skeleton-${rowIndex}`}>
                  {columns.map((_, columnIndex) => (
                    <TableCell key={`skeleton-${rowIndex}-${columnIndex}`}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data && data.length > 0 ? (
              /* ---------------------------------------
                 DATA
              --------------------------------------- */

              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              /* ---------------------------------------
                 EMPTY
              --------------------------------------- */

              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-500"
                >
                  No data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* =================================================
          SERVER PAGINATION
      ================================================= */}

      {onPageChange && totalPages > 0 ? (
        <div className="flex flex-col gap-3 border-t py-4 sm:flex-row sm:items-center sm:justify-between">
          {/* -------------------------------------------
              RECORD INFORMATION
          ------------------------------------------- */}

          <div className="text-sm text-muted-foreground">
            {totalRecords > 0 ? (
              <>
                Showing{" "}
                <span className="font-medium text-foreground">
                  {startRecord}
                </span>{" "}
                to{" "}
                <span className="font-medium text-foreground">{endRecord}</span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {totalRecords}
                </span>{" "}
                records
              </>
            ) : (
              "No records"
            )}
          </div>

          {/* -------------------------------------------
              PAGINATION CONTROLS
          ------------------------------------------- */}

          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={isLoading || page <= 1}
            >
              Previous
            </Button>

            <span className="min-w-[100px] text-center text-sm">
              Page <span className="font-medium">{page}</span> of{" "}
              <span className="font-medium">{totalPages}</span>
            </span>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={isLoading || page >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
