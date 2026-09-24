"use client";

import { useEffect, useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import type { QuestionType } from "./types";
import type { ExamFormValues } from "./ExamDetailsForm";

interface Props {
  questionTypes: QuestionType[];
  questionCounts: Record<number, number>;
}

export default function ExamSummary({ questionTypes, questionCounts }: Props) {
  const { control, setValue, register } = useFormContext<ExamFormValues>();
  const summary = useWatch({ control, name: "question_summary" }) ?? [];

  const activeTypeIds = useMemo(
    () => questionTypes.filter((type) => (questionCounts[type.id] ?? 0) > 0).map((type) => type.id),
    [questionCounts, questionTypes],
  );

  useEffect(() => {
    const currentByType = new Map(summary.map((item) => [item.question_type_id, item]));
    const next = activeTypeIds.map((typeId) => {
      const current = currentByType.get(typeId);
      return current ?? {
        question_type_id: typeId,
        question_per_person: questionCounts[typeId] ?? 1,
        marks_per_question: 1,
      };
    });

    const currentJson = JSON.stringify(summary);
    const nextJson = JSON.stringify(next);
    if (currentJson !== nextJson) {
      setValue("question_summary", next, { shouldValidate: true });
    }
  }, [activeTypeIds, questionCounts, setValue, summary]);

  if (!activeTypeIds.length) {
    return (
      <div className="rounded-lg border border-dashed p-5 text-sm text-muted-foreground">
        Add at least one question to configure the question summary.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {summary.map((item, index) => {
        const type = questionTypes.find((questionType) => questionType.id === item.question_type_id);
        if (!type) return null;

        return (
          <div key={item.question_type_id} className="grid grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium">Question Type</label>
              <Input value={`${type.question_type} (${questionCounts[type.id] ?? 0} questions)`} disabled />
              <input type="hidden" {...register(`question_summary.${index}.question_type_id`)} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Questions Per Person</label>
              <Input
                type="number"
                min={1}
                {...register(`question_summary.${index}.question_per_person`, { valueAsNumber: true })}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Marks Per Question</label>
              <Input
                type="number"
                min={0.01}
                step="0.01"
                {...register(`question_summary.${index}.marks_per_question`, { valueAsNumber: true })}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
