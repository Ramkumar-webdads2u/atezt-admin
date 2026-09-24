"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category, Coupon } from "./types";

export interface ExamFormValues {
  exam_name: string;
  description?: string;
  price: number;
  category_id: number;
  coupon_id: number | null;
  pass_mark: number;
  max_attempts: number;
  duration_minutes: number;
  review_cost: number;
  is_active: boolean;
  question_summary: Array<{
    question_type_id: number;
    question_per_person: number;
    marks_per_question: number;
  }>;
}

interface Props {
  categories: Category[];
  coupons: Coupon[];
  disabled?: boolean;
}

function getErrorMessage(error: unknown): string | undefined {
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message?: unknown }).message;
    return typeof message === "string" ? message : undefined;
  }
  return undefined;
}

export default function ExamDetailsForm({
  categories,
  coupons,
  disabled = false,
}: Props) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ExamFormValues>();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">Exam Name</label>
          <Input
            {...register("exam_name")}
            placeholder="Enter exam name"
            disabled={disabled}
          />
          {errors.exam_name && (
            <p className="mt-1 text-xs text-red-500">
              {errors.exam_name.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Exam Category</label>
          <Controller
            control={control}
            name="category_id"
            render={({ field }) => (
              <Select
                value={field.value > 0 ? String(field.value) : ""}
                onValueChange={(value) => field.onChange(Number(value))}
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select exam category" />
                </SelectTrigger>
                <SelectContent searchable searchPlaceholder="Search category...">
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.exam}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.category_id && (
            <p className="mt-1 text-xs text-red-500">
              {getErrorMessage(errors.category_id)}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Price</label>
          <Input
            type="number"
            min={0}
            step="0.01"
            {...register("price", { valueAsNumber: true })}
            placeholder="Enter price"
            disabled={disabled}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Coupon</label>
          <Controller
            control={control}
            name="coupon_id"
            render={({ field }) => (
              <Select
                value={field.value ? String(field.value) : "none"}
                onValueChange={(value) =>
                  field.onChange(value === "none" ? null : Number(value))
                }
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select coupon" />
                </SelectTrigger>
                <SelectContent searchable searchPlaceholder="Search coupon...">
                  <SelectItem value="none">No Coupon</SelectItem>
                  {coupons.map((coupon) => (
                    <SelectItem key={coupon.id} value={String(coupon.id)}>
                      {coupon.coupon_name} ({coupon.coupon_code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Exam Description</label>
        <Textarea
          {...register("description")}
          placeholder="Enter exam description"
          rows={6}
          disabled={disabled}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div>
          <label className="mb-2 block text-sm font-medium">Pass Mark</label>
          <Input
            type="number"
            min={0}
            {...register("pass_mark", { valueAsNumber: true })}
            placeholder="Enter pass mark"
            disabled={disabled}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Max Attempts</label>
          <Input
            type="number"
            min={1}
            {...register("max_attempts", { valueAsNumber: true })}
            placeholder="Enter max attempts"
            disabled={disabled}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Duration (Minutes)</label>
          <Input
            type="number"
            min={1}
            {...register("duration_minutes", { valueAsNumber: true })}
            placeholder="Enter duration"
            disabled={disabled}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Review Cost</label>
          <Input
            type="number"
            min={0}
            step="0.01"
            {...register("review_cost", { valueAsNumber: true })}
            placeholder="Enter review cost"
            disabled={disabled}
          />
        </div>
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          {...register("is_active")}
          disabled={disabled}
        />
        <span className="text-sm font-medium">Active Exam</span>
      </label>
    </div>
  );
}
