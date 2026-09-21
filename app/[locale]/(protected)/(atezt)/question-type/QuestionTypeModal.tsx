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

import type { QuestionType } from "./QuestionTypeList";

/* =========================================================
   PROPS
========================================================= */

interface QuestionTypeModalProps {
  mode: "add" | "edit";

  questionType?: QuestionType;

  onClose: () => void;
}

/* =========================================================
   FORM SCHEMA
========================================================= */

const schema = z.object({
  question_type: z.string().trim().min(1, "Question type is required"),

  options: z.coerce
    .number()
    .int("Options must be a whole number")
    .min(0, "Options cannot be negative"),

  is_active: z.boolean(),
});

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
   COMPONENT
========================================================= */

const QuestionTypeModal: React.FC<QuestionTypeModalProps> = ({
  mode,

  questionType,

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
      question_type: questionType?.question_type || "",

      options: questionType?.options ?? 0,

      is_active: questionType?.is_active ?? true,
    },
  });

  /* =======================================================
     ACTIVE STATUS
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
        question_type: data.question_type.trim(),

        options: data.options,

        is_active: data.is_active,
      };

      /* ==============================================
           API URL
        ============================================== */

      const apiUrl =
        mode === "add"
          ? APICONSTANT.CreateQuestionType
          : APICONSTANT.UpdateQuestionType.replace(
              "{question_type_id}",
              String(questionType?.id),
            );

      /* ==============================================
           LOG
        ============================================== */

      console.log("================================");

      console.log(
        mode === "add" ? "CREATE QUESTION TYPE" : "UPDATE QUESTION TYPE",
      );

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

      console.log("API RESPONSE:", response);

      /* ==============================================
           SUCCESS
        ============================================== */

      if (response?.success === true) {
        await queryClient.invalidateQueries({
          queryKey: ["GetQuestionTypes"],
        });

        onClose();

        return;
      }

      /* ==============================================
           FAILURE
        ============================================== */

      console.error("API returned unsuccessful response:", response);

      alert(response?.message || "Failed to save question type.");
    } catch (error) {
      console.error("QUESTION TYPE MUTATION ERROR:", error);
    }
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <DialogContent size="sm">
      <DialogHeader>
        <DialogTitle>
          {mode === "add" ? "Add Question Type" : "Edit Question Type"}
        </DialogTitle>

        <DialogDescription>
          {mode === "add"
            ? "Fill in the details to create a new question type."
            : "Update the question type details below."}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* =================================================
            QUESTION TYPE
        ================================================= */}

        <div className="space-y-2">
          <Label htmlFor="question_type">Question Type</Label>

          <Input
            id="question_type"

            placeholder="Enter question type"

            {...register("question_type")}

            disabled={isPending}
          />

          {errors.question_type && (
            <p className="text-xs text-red-500">
              {errors.question_type.message}
            </p>
          )}
        </div>

        {/* =================================================
            OPTIONS
        ================================================= */}

        <div className="space-y-2">
          <Label htmlFor="options">Options</Label>

          <Input
            id="options"

            type="number"

            min={0}

            placeholder="Enter number of options"

            {...register("options", {
              valueAsNumber: true,
            })}

            disabled={isPending}
          />

          {errors.options && (
            <p className="text-xs text-red-500">{errors.options.message}</p>
          )}
        </div>

        {/* =================================================
            ACTIVE STATUS
        ================================================= */}

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <Label>Active Status</Label>

            <p className="mt-1 text-xs text-muted-foreground">
              Enable or disable this question type.
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

          <Button
            type="submit"

            disabled={isPending}
          >
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

export default QuestionTypeModal;
