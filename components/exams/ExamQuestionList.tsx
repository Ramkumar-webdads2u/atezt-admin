"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FrontendQuestion, QuestionType } from "./types";

interface Props {
  questions: FrontendQuestion[];
  questionTypes: QuestionType[];
  onEdit: (question: FrontendQuestion) => void;
  onDelete: (localId: string) => void;
}

export default function ExamQuestionList({
  questions,
  questionTypes,
  onEdit,
  onDelete,
}: Props) {
  const getTypeName = (id: number) =>
    questionTypes.find((type) => type.id === id)?.question_type ?? "Unknown";

  if (!questions.length) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
        No questions added yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {questions.map((question, index) => {
        const optionCount = questionTypes.find(
          (type) => type.id === question.question_type_id,
        )?.options ?? 0;
        const imageCount =
          question.existing_question_image_keys.length + question.question_image_files.length;

        return (
          <div key={question.localId} className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>Question {index + 1}</span>
                  <span>•</span>
                  <span>{getTypeName(question.question_type_id)}</span>
                  <span>•</span>
                  <span>{question.marks} marks</span>
                  <span>•</span>
                  <span>{imageCount} image(s)</span>
                </div>

                <p className="font-medium">{question.question || "Image-based question"}</p>

                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {Array.from({ length: optionCount }, (_, optionIndex) => {
                    const number = optionIndex + 1;
                    const text = question[`option${number}` as keyof FrontendQuestion];
                    const isCorrect = question.correct_option === number;
                    return (
                      <div
                        key={number}
                        className={`rounded-md border p-2 text-sm ${isCorrect ? "border-green-500 bg-green-50" : ""}`}
                      >
                        <span className="font-medium">
                          {String.fromCharCode(64 + number)}.
                        </span>{" "}
                        {typeof text === "string" ? text || "Image option" : "Image option"}
                        {isCorrect && <span className="ml-2 text-xs font-semibold text-green-700">Correct</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex shrink-0 gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => onEdit(question)}>
                  <Pencil className="mr-1 h-4 w-4" />
                  Edit
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => onDelete(question.localId)}>
                  <Trash2 className="mr-1 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
