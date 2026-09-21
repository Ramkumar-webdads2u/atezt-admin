"use client";

import React from "react";

import { z } from "zod";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2 } from "lucide-react";

import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import useApiMutation from "@/hooks/Mutations/useApiMutation";

import { APICONSTANT } from "@/services/apiconfig";

import { useQueryClient } from "@tanstack/react-query";

import type { Coupon } from "./CouponList";

/* =========================================================
   PROPS
========================================================= */

interface CouponModalProps {
  mode: "add" | "edit";

  coupon?: Coupon;

  onClose: () => void;
}

/* =========================================================
   FORM SCHEMA
========================================================= */

const schema = z
  .object({
    coupon_name: z.string().trim().min(1, "Coupon name is required"),

    coupon_code: z.string().trim().min(1, "Coupon code is required"),

    description: z.string().trim().min(1, "Description is required"),

    percentage: z.coerce
      .number()
      .min(1, "Percentage must be at least 1")
      .max(100, "Percentage cannot exceed 100"),

    valid_from: z.string().min(1, "Valid from is required"),

    valid_until: z.string().min(1, "Valid until is required"),

    is_active: z.boolean(),

    usage_limit: z.coerce
      .number()
      .int("Usage limit must be a whole number")
      .min(1, "Usage limit must be at least 1"),
  })
  .refine(
    (data) =>
      new Date(data.valid_until).getTime() >
      new Date(data.valid_from).getTime(),
    {
      message: "Valid until must be after valid from",
      path: ["valid_until"],
    },
  );

/* =========================================================
   TYPES
========================================================= */

type FormInput = z.input<typeof schema>;

type FormValues = z.output<typeof schema>;

/* =========================================================
   API RESPONSE
========================================================= */

interface ApiResponse {
  success?: boolean;

  error?: boolean;

  message?: string;

  data?: unknown;
}

/* =========================================================
   DATE HELPERS
========================================================= */

/*
 * API:
 * 07-09-2026 03:13:19 PM
 *
 * Input:
 * 2026-09-07T15:13
 */

const apiDateToInput = (value?: string): string => {
  if (!value) {
    return "";
  }

  /*
   * Already ISO
   */

  if (value.includes("T")) {
    return value.slice(0, 16);
  }

  const match = value.match(
    /^(\d{2})-(\d{2})-(\d{4})\s+(\d{2}):(\d{2}):(\d{2})\s+(AM|PM)$/i,
  );

  if (!match) {
    return "";
  }

  const [, day, month, year, hourString, minute, , period] = match;

  let hour = Number(hourString);

  const upperPeriod = period.toUpperCase();

  if (upperPeriod === "PM" && hour !== 12) {
    hour += 12;
  }

  if (upperPeriod === "AM" && hour === 12) {
    hour = 0;
  }

  return `${year}-${month}-${day}T${String(hour).padStart(2, "0")}:${minute}`;
};

/*
 * datetime-local:
 * 2026-09-21T11:26
 *
 * API:
 * ISO string
 */

const inputDateToISO = (value: string): string => {
  return new Date(value).toISOString();
};

/* =========================================================
   COMPONENT
========================================================= */

const CouponModal: React.FC<CouponModalProps> = ({
  mode,

  coupon,

  onClose,
}) => {
  /* =======================================================
           QUERY CLIENT
        ======================================================= */

  const queryClient = useQueryClient();

  /* =======================================================
           MUTATION
        ======================================================= */

  const mutation = useApiMutation(mode === "add" ? "post" : "put");

  /* =======================================================
           FORM
        ======================================================= */

  const {
    register,

    handleSubmit,

    formState: { errors },

    setValue,

    watch,
  } = useForm<FormInput, any, FormValues>({
    resolver: zodResolver(schema),

    defaultValues: {
      coupon_name: coupon?.coupon_name || "",

      coupon_code: coupon?.coupon_code || "",

      description: coupon?.description || "",

      percentage: coupon?.percentage ?? 1,

      valid_from: apiDateToInput(coupon?.valid_from),

      valid_until: apiDateToInput(coupon?.valid_until),

      is_active: coupon?.is_active ?? true,

      usage_limit: coupon?.usage_limit ?? 1,
    },
  });

  /* =======================================================
           STATUS
        ======================================================= */

  const isActive = watch("is_active");

  /* =======================================================
           LOADING
        ======================================================= */

  const isPending = mutation.isPending;

  /* =======================================================
           SUBMIT
        ======================================================= */

  const onSubmit = async (data: FormValues) => {
    try {
      /* ==============================================
                       PAYLOAD
                    ============================================== */

      const payload = {
        coupon_name: data.coupon_name.trim(),

        coupon_code: data.coupon_code.trim(),

        description: data.description.trim(),

        percentage: data.percentage,

        valid_from: inputDateToISO(data.valid_from),

        valid_until: inputDateToISO(data.valid_until),

        is_active: data.is_active,

        usage_limit: data.usage_limit,
      };

      /* ==============================================
                       API URL
                    ============================================== */

      const apiUrl =
        mode === "add"
          ? APICONSTANT.CreateCoupon
          : APICONSTANT.UpdateCoupon.replace("{coupon_id}", String(coupon?.id));

      /* ==============================================
                       LOG
                    ============================================== */

      console.log("================================");

      console.log(mode === "add" ? "CREATE COUPON" : "UPDATE COUPON");

      console.log("METHOD:", mode === "add" ? "POST" : "PUT");

      console.log("API:", apiUrl);

      console.log("PAYLOAD:", payload);

      console.log("================================");

      /* ==============================================
                       REQUEST
                    ============================================== */

      const response = (await mutation.mutateAsync({
        url: {
          apiUrl,
        },

        body: payload,
      })) as ApiResponse;

      console.log("COUPON API RESPONSE:", response);

      /* ==============================================
                       SUCCESS
                    ============================================== */

      if (response?.success === true) {
        await queryClient.invalidateQueries({
          queryKey: ["GetCoupons"],
        });

        onClose();

        return;
      }

      /* ==============================================
                       FAILURE
                    ============================================== */

      console.error("API returned unsuccessful response:", response);

      alert(response?.message || "Failed to save coupon.");
    } catch (error) {
      console.error("COUPON MUTATION ERROR:", error);
    }
  };

  /* =======================================================
           UI
        ======================================================= */

  return (
    <DialogContent size="md">
      <DialogHeader>
        <DialogTitle>
          {mode === "add" ? "Add Coupon" : "Edit Coupon"}
        </DialogTitle>

        <DialogDescription>
          {mode === "add"
            ? "Fill in the details to create a new coupon."
            : "Update the coupon details below."}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* =================================================
        COUPON NAME + COUPON CODE
    ================================================= */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* COUPON NAME */}

          <div className="space-y-2">
            <Label htmlFor="coupon_name">Coupon Name</Label>

            <Input
              id="coupon_name"
              placeholder="Enter coupon name"
              {...register("coupon_name")}
              disabled={isPending}
            />

            {errors.coupon_name && (
              <p className="text-xs text-red-500">
                {errors.coupon_name.message}
              </p>
            )}
          </div>

          {/* COUPON CODE */}

          <div className="space-y-2">
            <Label htmlFor="coupon_code">Coupon Code</Label>

            <Input
              id="coupon_code"
              placeholder="Enter coupon code"
              {...register("coupon_code")}
              disabled={isPending}
            />

            {errors.coupon_code && (
              <p className="text-xs text-red-500">
                {errors.coupon_code.message}
              </p>
            )}
          </div>
        </div>

        {/* =================================================
        PERCENTAGE + USAGE LIMIT
    ================================================= */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* PERCENTAGE */}

          <div className="space-y-2">
            <Label htmlFor="percentage">Percentage</Label>

            <Input
              id="percentage"
              type="number"
              min={1}
              max={100}
              {...register("percentage", {
                valueAsNumber: true,
              })}
              disabled={isPending}
            />

            {errors.percentage && (
              <p className="text-xs text-red-500">
                {errors.percentage.message}
              </p>
            )}
          </div>

          {/* USAGE LIMIT */}

          <div className="space-y-2">
            <Label htmlFor="usage_limit">Usage Limit</Label>

            <Input
              id="usage_limit"
              type="number"
              min={1}
              {...register("usage_limit", {
                valueAsNumber: true,
              })}
              disabled={isPending}
            />

            {errors.usage_limit && (
              <p className="text-xs text-red-500">
                {errors.usage_limit.message}
              </p>
            )}
          </div>
        </div>

        {/* =================================================
        VALID FROM + VALID UNTIL
    ================================================= */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* VALID FROM */}

          <div className="space-y-2">
            <Label htmlFor="valid_from">Valid From</Label>

            <Input
              id="valid_from"
              type="datetime-local"
              {...register("valid_from")}
              disabled={isPending}
            />

            {errors.valid_from && (
              <p className="text-xs text-red-500">
                {errors.valid_from.message}
              </p>
            )}
          </div>

          {/* VALID UNTIL */}

          <div className="space-y-2">
            <Label htmlFor="valid_until">Valid Until</Label>

            <Input
              id="valid_until"
              type="datetime-local"
              {...register("valid_until")}
              disabled={isPending}
            />

            {errors.valid_until && (
              <p className="text-xs text-red-500">
                {errors.valid_until.message}
              </p>
            )}
          </div>
        </div>

        {/* =================================================
        DESCRIPTION
    ================================================= */}

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>

          <textarea
            id="description"
            {...register("description")}
            placeholder="Enter coupon description"
            rows={4}
            disabled={isPending}
            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />

          {errors.description && (
            <p className="text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* =================================================
        ACTIVE STATUS
    ================================================= */}

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <Label>Active Status</Label>

            <p className="mt-1 text-xs text-muted-foreground">
              Enable or disable this coupon.
            </p>
          </div>

          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              setValue("is_active", !isActive, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            className={`relative h-6 w-11 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              isActive ? "bg-green-500" : "bg-gray-300"
            }`}
            aria-label="Toggle active status"
          >
            <span
              className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                isActive ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>

        {/* =================================================
        FOOTER
    ================================================= */}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

            {isPending
              ? mode === "add"
                ? "Creating..."
                : "Updating..."
              : mode === "add"
                ? "Create"
                : "Update"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default CouponModal;
