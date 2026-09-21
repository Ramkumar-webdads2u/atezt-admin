"use client";

import React from "react";

import useReactQuery from "@/hooks/useReactQuery";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Skeleton } from "@/components/ui/skeleton";

import type { AdminUser } from "./UsersList";

interface ExamDetails {
  id: number;
  name: string;

  category: {
    id: number;
    name: string;
  };

  purchase: {
    is_purchased: boolean;
    amount: number;
    discount_amount: number;
    final_amount: number;
    is_paid: boolean;
    purchased_at: string;
  };

  used_attempts: number;
  left_attempts: number;

  result: {
    status: string;
    score: number;
    obtained_marks: number;
    total_marks: number;
    pass_mark: number;
    is_passed: boolean;
    percentage: number;
  };
}

interface UserExamDetailsResponse {
  success: boolean;
  message: string;

  user: {
    id: number;
    username: string;
    email: string;
  };

  data: ExamDetails[];
}

interface UserExamDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AdminUser | null;
}

function UserExamDetailsModal({
  open,
  onOpenChange,
  user,
}: UserExamDetailsModalProps) {
  const queryString = user?.id ? String(user.id) : "";

  const {
    data: response,
    isLoading,
    isError,
  } = useReactQuery<UserExamDetailsResponse>(
    "GetUserExamDetails",
    queryString,
    open && !!user,
  );

  const examDetails = response?.data ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {user?.username
              ? `${user.username} - Exam Details`
              : "Exam Details"}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="rounded-xl border p-4">
                <Skeleton className="h-5 w-48" />

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="py-8 text-center text-sm text-red-500">
            Failed to load exam details.
          </div>
        ) : examDetails.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No exam details found.
          </div>
        ) : (
          <div className="space-y-4">
            {examDetails.map((exam) => (
              <div
                key={exam.id}
                className="rounded-xl border bg-background p-4"
              >
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Exam
                  </p>

                  <h3 className="mt-1 text-base font-semibold">{exam.name}</h3>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Category
                    </p>

                    <p className="mt-1 text-sm">
                      {exam.category?.name || "---"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Purchase Amount
                    </p>

                    <p className="mt-1 text-sm">
                      ₹{exam.purchase?.final_amount ?? 0}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Used Attempts
                    </p>

                    <p className="mt-1 text-sm">{exam.used_attempts ?? 0}</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Left Attempts
                    </p>

                    <p className="mt-1 text-sm">{exam.left_attempts ?? 0}</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Payment
                    </p>

                    <p
                      className={
                        exam.purchase?.is_paid
                          ? "mt-1 font-medium text-green-600"
                          : "mt-1 font-medium text-red-500"
                      }
                    >
                      {exam.purchase?.is_paid ? "Paid" : "Not Paid"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Result
                    </p>

                    <p
                      className={
                        exam.result?.is_passed
                          ? "mt-1 font-medium text-green-600"
                          : "mt-1 font-medium text-red-500"
                      }
                    >
                      {exam.result?.status || "---"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 border-t pt-4">
                  <p className="mb-3 text-sm font-semibold">Result Details</p>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Score</p>

                      <p className="mt-1 text-sm font-medium">
                        {exam.result?.score ?? 0}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">Marks</p>

                      <p className="mt-1 text-sm font-medium">
                        {exam.result?.obtained_marks ?? 0} /{" "}
                        {exam.result?.total_marks ?? 0}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">Pass Mark</p>

                      <p className="mt-1 text-sm font-medium">
                        {exam.result?.pass_mark ?? 0}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Percentage
                      </p>

                      <p className="mt-1 text-sm font-medium">
                        {exam.result?.percentage ?? 0}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 border-t pt-4">
                  <p className="mb-3 text-sm font-semibold">Purchase Details</p>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Purchased</p>

                      <p className="mt-1 text-sm">
                        {exam.purchase?.is_purchased ? "Yes" : "No"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">Discount</p>

                      <p className="mt-1 text-sm">
                        ₹{exam.purchase?.discount_amount ?? 0}
                      </p>
                    </div>

                    <div className="col-span-2">
                      <p className="text-xs text-muted-foreground">
                        Purchased At
                      </p>

                      <p className="mt-1 break-words text-sm">
                        {exam.purchase?.purchased_at || "---"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default UserExamDetailsModal;
