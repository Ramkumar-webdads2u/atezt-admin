"use client";

import React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

/* =========================================================
   CARD FIELD
========================================================= */

export interface CardField<TData> {
  key: string;

  label: string;

  /*
   * 1 = normal column
   * 2 = full width
   */
  colSpan?: 1 | 2;

  render?: (item: TData) => React.ReactNode;
}

/* =========================================================
   CARD PROPS
========================================================= */

interface CardReusableProps<TData> {
  data: TData[];

  fields: CardField<TData>[];

  getKey?: (item: TData, index: number) => string | number;

  actions?: (item: TData) => React.ReactNode;

  isLoading?: boolean;

  loadingCount?: number;

  emptyMessage?: string;

  /* Server pagination */

  page?: number;

  pageSize?: number;

  totalPages?: number;

  totalRecords?: number;

  onPageChange?: (page: number) => void;
}

/* =========================================================
   CARD REUSABLE
========================================================= */

export function CardReusable<TData>({
  data,

  fields,

  getKey,

  actions,

  isLoading = false,

  loadingCount = 5,

  emptyMessage = "No data found.",

  page = 1,

  pageSize = 10,

  totalPages = 1,

  totalRecords = 0,

  onPageChange,
}: CardReusableProps<TData>) {
  /* =======================================================
     PAGINATION
  ======================================================= */

  const startRecord = totalRecords === 0 ? 0 : (page - 1) * pageSize + 1;

  const endRecord = Math.min(page * pageSize, totalRecords);

  const handlePrevious = () => {
    if (isLoading || page <= 1) {
      return;
    }

    onPageChange?.(page - 1);
  };

  const handleNext = () => {
    if (isLoading || page >= totalPages) {
      return;
    }

    onPageChange?.(page + 1);
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="w-full pb-24">
      {/* =================================================
          LOADING
      ================================================= */}

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({
            length: Math.min(loadingCount, 5),
          }).map((_, index) => (
            <div
              key={`card-loading-${index}`}
              className="rounded-xl border bg-background px-4 py-4"
            >
              {/* Header */}

              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <Skeleton className="h-3 w-16" />

                  <Skeleton className="mt-2 h-5 w-36" />
                </div>

                {actions && (
                  <Skeleton className="h-8 w-8 shrink-0 rounded-md" />
                )}
              </div>

              {/* Details */}

              <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-5">
                {fields.slice(1).map((field) => (
                  <div
                    key={field.key}
                    className={
                      field.colSpan === 2 ? "col-span-2" : "col-span-1"
                    }
                  >
                    <Skeleton className="h-3 w-20" />

                    <Skeleton className="mt-2 h-4 w-28" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : data.length === 0 ? (
        /* =================================================
           EMPTY
        ================================================= */

        <div className="rounded-xl border bg-background py-12 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </div>
      ) : (
        /* =================================================
           DATA
        ================================================= */

        <>
          <div className="space-y-4">
            {data.map((item, index) => {
              const key = getKey?.(item, index) ?? index;

              const firstField = fields[0];

              const remainingFields = fields.slice(1);

              return (
                <div
                  key={key}
                  className="rounded-xl border bg-background px-4 py-4 shadow-sm"
                >
                  {/* =====================================
                        HEADER
                    ===================================== */}

                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      {firstField && (
                        <>
                          <div className="text-xs font-medium text-muted-foreground">
                            {firstField.label}
                          </div>

                          <div className="mt-1 break-words text-base font-semibold leading-6 text-foreground">
                            {firstField.render
                              ? firstField.render(item)
                              : "---"}
                          </div>
                        </>
                      )}
                    </div>

                    {/* ACTION */}

                    {actions && <div className="shrink-0">{actions(item)}</div>}
                  </div>

                  {/* =====================================
                        DETAILS
                    ===================================== */}

                  {remainingFields.length > 0 && (
                    <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-5">
                      {remainingFields.map((field) => (
                        <div
                          key={field.key}
                          className={
                            field.colSpan === 2
                              ? "col-span-2 min-w-0"
                              : "col-span-1 min-w-0"
                          }
                        >
                          {/* LABEL */}

                          <div className="text-xs font-medium text-muted-foreground">
                            {field.label}
                          </div>

                          {/* VALUE */}

                          <div className="mt-1 break-words text-sm leading-5 text-foreground">
                            {field.render ? field.render(item) : "---"}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* =================================================
              PAGINATION
          ================================================= */}

          {onPageChange && totalPages > 0 && (
            <div className="mt-6 border-t pt-4">
              {/* RECORD COUNT */}

              <div className="mb-3 text-center text-xs text-muted-foreground">
                {totalRecords > 0 ? (
                  <>
                    Showing{" "}
                    <span className="font-medium text-foreground">
                      {startRecord}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium text-foreground">
                      {endRecord}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-foreground">
                      {totalRecords}
                    </span>
                  </>
                ) : (
                  "No records"
                )}
              </div>

              {/* BUTTONS */}

              <div className="flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="min-w-[82px]"
                  disabled={isLoading || page <= 1}
                  onClick={handlePrevious}
                >
                  Previous
                </Button>

                <div className="whitespace-nowrap text-xs text-muted-foreground">
                  Page{" "}
                  <span className="font-semibold text-foreground">{page}</span>{" "}
                  of{" "}
                  <span className="font-semibold text-foreground">
                    {totalPages}
                  </span>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="min-w-[62px]"
                  disabled={isLoading || page >= totalPages}
                  onClick={handleNext}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CardReusable;
