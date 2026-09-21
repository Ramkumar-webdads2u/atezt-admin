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

import type { ExamCategory } from "./ExamCategoryList";

interface ExamCategoryModalProps {
  mode: "add" | "edit";
  category?: ExamCategory;
  onClose: () => void;
}

/* =====================================================
   FORM SCHEMA
===================================================== */

const schema = z.object({
  exam: z
    .string()
    .trim()
    .min(1, "Exam name is required"),

  description: z
    .string()
    .trim()
    .min(1, "Description is required"),

  is_active: z.boolean(),

  /*
   * Temporarily disabled
   *
   * duration_minutes: z.coerce
   *   .number()
   *   .min(1),
   *
   * total_marks: z.coerce
   *   .number()
   *   .min(0),
   */
});

type FormInput = z.input<typeof schema>;
type FormValues = z.output<typeof schema>;

/* =====================================================
   API RESPONSE
===================================================== */

interface ApiResponse {
  success?: boolean;
  error?: boolean;
  message?: string;
  data?: unknown;
}

/* =====================================================
   COMPONENT
===================================================== */

const ExamCategoryModal: React.FC<
  ExamCategoryModalProps
> = ({
  mode,
  category,
  onClose,
}) => {
  const queryClient =
    useQueryClient();

  /*
   * POST / PUT
   */
  const mutation =
    useApiMutation(
      mode === "add"
        ? "post"
        : "put"
    );

  /* =====================================================
     FORM
  ===================================================== */

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
    setValue,
    watch,
  } = useForm<
    FormInput,
    any,
    FormValues
  >({
    resolver:
      zodResolver(schema),

    defaultValues: {
      exam:
        category?.exam || "",

      description:
        category?.description || "",

      is_active:
        category?.is_active ?? true,
    },
  });

  const isActive =
    watch("is_active");

  /*
   * React Query mutation loading state
   *
   * DO NOT use useTransition here.
   */
  const isPending =
    mutation.isPending;

  /* =====================================================
     SUBMIT
  ===================================================== */

  const onSubmit = async (
    data: FormValues
  ) => {
    try {
      /* ---------------------------------------------
         PAYLOAD
      --------------------------------------------- */

      const payload = {
        exam: data.exam.trim(),

        description:
          data.description.trim(),

        is_active:
          data.is_active,

        /*
         * Temporarily disabled
         *
         * duration_minutes:
         *   data.duration_minutes,
         *
         * total_marks:
         *   data.total_marks,
         */
      };

      /* ---------------------------------------------
         API URL
      --------------------------------------------- */

      const apiUrl =
        mode === "add"
          ? APICONSTANT.CreateExamCategory
          : APICONSTANT.UpdateExamCategory.replace(
              "{category_id}",
              String(category?.id)
            );

      console.log(
        "================================"
      );

      console.log(
        mode === "add"
          ? "🚀 CREATE EXAM CATEGORY"
          : "🚀 UPDATE EXAM CATEGORY"
      );

      console.log(
        "METHOD:",
        mode === "add"
          ? "POST"
          : "PUT"
      );

      console.log(
        "API:",
        apiUrl
      );

      console.log(
        "PAYLOAD:",
        payload
      );

      console.log(
        "================================"
      );

      /* ---------------------------------------------
         API REQUEST
      --------------------------------------------- */

      const response =
        (await mutation.mutateAsync({
          url: {
            apiUrl,
          },

          body: payload,
        })) as ApiResponse;

      console.log(
        "✅ API RESPONSE:",
        response
      );

      /* ---------------------------------------------
         SUCCESS
      --------------------------------------------- */

      if (
        response?.success === true
      ) {
        console.log(
          "✅ Mutation successful"
        );

        /*
         * Refresh Exam Categories
         */
        // await queryClient.invalidateQueries({
        //   queryKey: [
        //     "GetExamCategories",
        //   ],
        // });

        /*
         * Explicitly refetch the active
         * Exam Categories query.
         *
         * invalidateQueries is enough normally,
         * but this guarantees the table updates.
         */
        // await queryClient.refetchQueries({
        //   queryKey: [
        //     "GetExamCategories",
        //   ],
        // });

        /*
         * Close modal
         */
        if (response?.success === true) {
  await queryClient.invalidateQueries({
    queryKey: ["GetExamCategories"],
  });

  onClose();
}

        return;
      }

      /* ---------------------------------------------
         API RETURNED FAILURE
      --------------------------------------------- */

      console.error(
        "❌ API returned unsuccessful response:",
        response
      );

      alert(
        response?.message ||
          "Failed to save exam category."
      );
    } catch (error) {
      console.error(
        "❌ EXAM CATEGORY MUTATION ERROR:",
        error
      );
    }
  };

  /* =====================================================
     UI
  ===================================================== */

  return (
    <DialogContent size="sm">

      <DialogHeader>

        <DialogTitle>
          {mode === "add"
            ? "Add Exam Category"
            : "Edit Exam Category"}
        </DialogTitle>

        <DialogDescription>
          {mode === "add"
            ? "Fill in the details to create a new exam category."
            : "Update the exam category details below."}
        </DialogDescription>

      </DialogHeader>

      <form
        onSubmit={handleSubmit(
          onSubmit
        )}
        className="space-y-5"
      >

        {/* =========================================
            EXAM
        ========================================= */}

        <div className="space-y-2">

          <Label htmlFor="exam">
            Exam
          </Label>

          <Input
            id="exam"
            placeholder="Enter exam name"
            {...register("exam")}
            disabled={isPending}
          />

          {errors.exam && (
            <p className="text-xs text-red-500">
              {errors.exam.message}
            </p>
          )}

        </div>

        {/* =========================================
            DESCRIPTION
        ========================================= */}

        <div className="space-y-2">

          <Label htmlFor="description">
            Description
          </Label>

          <textarea
            id="description"
            {...register(
              "description"
            )}
            placeholder="Enter exam description"
            rows={4}
            disabled={isPending}
            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />

          {errors.description && (
            <p className="text-xs text-red-500">
              {
                errors.description
                  .message
              }
            </p>
          )}

        </div>

        {/* =========================================
            DURATION - DISABLED
        ========================================= */}

        {/*
        <div className="space-y-2">

          <Label htmlFor="duration_minutes">
            Duration (Minutes)
          </Label>

          <Input
            id="duration_minutes"
            type="number"
            min={1}
            {...register(
              "duration_minutes",
              {
                valueAsNumber: true,
              }
            )}
            disabled={isPending}
          />

        </div>
        */}

        {/* =========================================
            TOTAL MARKS - DISABLED
        ========================================= */}

        {/*
        <div className="space-y-2">

          <Label htmlFor="total_marks">
            Total Marks
          </Label>

          <Input
            id="total_marks"
            type="number"
            min={0}
            {...register(
              "total_marks",
              {
                valueAsNumber: true,
              }
            )}
            disabled={isPending}
          />

        </div>
        */}

        {/* =========================================
            ACTIVE STATUS
        ========================================= */}

        <div className="flex items-center justify-between rounded-lg border p-4">

          <div>

            <Label>
              Active Status
            </Label>

            <p className="mt-1 text-xs text-muted-foreground">
              Enable or disable this
              exam category.
            </p>

          </div>

          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              setValue(
                "is_active",
                !isActive,
                {
                  shouldDirty: true,
                  shouldValidate: true,
                }
              )
            }
            className={`relative h-6 w-11 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              isActive
                ? "bg-green-500"
                : "bg-gray-300"
            }`}
            aria-label="Toggle active status"
          >

            <span
              className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                isActive
                  ? "left-6"
                  : "left-1"
              }`}
            />

          </button>

        </div>

        {/* =========================================
            FOOTER
        ========================================= */}

        <DialogFooter>

          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isPending}
          >

            {isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}

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

export default ExamCategoryModal;