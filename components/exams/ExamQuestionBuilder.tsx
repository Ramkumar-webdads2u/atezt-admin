"use client";

import { useEffect, useMemo } from "react";
import { Pencil, Plus, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FrontendQuestion, QuestionType } from "./types";

const questionSchema = z.object({
  question_type_id: z.number().int().positive("Question type is required"),
  question: z.string().optional(),
  question_images: z.instanceof(FileList).optional(),
  option1: z.string().optional(),
  option1_image: z.instanceof(FileList).optional(),
  option2: z.string().optional(),
  option2_image: z.instanceof(FileList).optional(),
  option3: z.string().optional(),
  option3_image: z.instanceof(FileList).optional(),
  option4: z.string().optional(),
  option4_image: z.instanceof(FileList).optional(),
  option5: z.string().optional(),
  option5_image: z.instanceof(FileList).optional(),
  option6: z.string().optional(),
  option6_image: z.instanceof(FileList).optional(),
  correct_option: z.number().int().min(1).max(6),
  marks: z.number().positive("Marks must be greater than 0"),
  question_order: z.number().int().positive(),
  is_active: z.boolean(),
});

type QuestionFormValues = z.infer<typeof questionSchema>;

const emptyValues: QuestionFormValues = {
  question_type_id: 0,
  question: "",
  question_images: undefined,
  option1: "",
  option1_image: undefined,
  option2: "",
  option2_image: undefined,
  option3: "",
  option3_image: undefined,
  option4: "",
  option4_image: undefined,
  option5: "",
  option5_image: undefined,
  option6: "",
  option6_image: undefined,
  correct_option: 1,
  marks: 1,
  question_order: 1,
  is_active: true,
};

interface Props {
  questionTypes: QuestionType[];
  questions: FrontendQuestion[];
  editingQuestion: FrontendQuestion | null;
  onSave: (question: FrontendQuestion) => void;
  onCancelEdit: () => void;
}

type OptionNumber = 1 | 2 | 3 | 4 | 5 | 6;

function getFileList(files: FileList | undefined): File[] {
  return files ? Array.from(files) : [];
}

function getExistingOptionKey(
  question: FrontendQuestion,
  optionNumber: OptionNumber,
): string | null {
  const keys: Record<OptionNumber, string | null> = {
    1: question.existing_option1_image_key,
    2: question.existing_option2_image_key,
    3: question.existing_option3_image_key,
    4: question.existing_option4_image_key,
    5: question.existing_option5_image_key,
    6: question.existing_option6_image_key,
  };
  return keys[optionNumber];
}

function getSelectedOptionFiles(
  values: QuestionFormValues,
  optionNumber: OptionNumber,
): File[] {
  const fileLists: Record<OptionNumber, FileList | undefined> = {
    1: values.option1_image,
    2: values.option2_image,
    3: values.option3_image,
    4: values.option4_image,
    5: values.option5_image,
    6: values.option6_image,
  };
  return getFileList(fileLists[optionNumber]);
}

export default function ExamQuestionBuilder({
  questionTypes,
  questions,
  editingQuestion,
  onSave,
  onCancelEdit,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: emptyValues,
  });

  const questionTypeId = watch("question_type_id");
  const correctOption = watch("correct_option");

  const selectedType = useMemo(
    () => questionTypes.find((item) => item.id === questionTypeId),
    [questionTypes, questionTypeId],
  );

  const optionCount = selectedType?.options ?? 0;

  useEffect(() => {
    if (editingQuestion) {
      reset({
        ...emptyValues,
        question_type_id: editingQuestion.question_type_id,
        question: editingQuestion.question,
        correct_option: editingQuestion.correct_option,
        marks: editingQuestion.marks,
        question_order: editingQuestion.question_order,
        is_active: editingQuestion.is_active,
      });
      return;
    }

    reset({
      ...emptyValues,
      question_order: questions.length + 1,
    });
  }, [editingQuestion, questions.length, reset]);

  useEffect(() => {
    if (!selectedType) return;

    if (correctOption > optionCount) {
      setValue("correct_option", 1, { shouldValidate: true });
    }
  }, [correctOption, optionCount, selectedType, setValue]);

  const submit = (values: QuestionFormValues) => {
    const existing = editingQuestion;

    const questionImageFiles = getFileList(values.question_images);

    const nextQuestion: FrontendQuestion = {
      localId: existing?.localId ?? crypto.randomUUID(),
      id: existing?.id,
      question_type_id: values.question_type_id,
      question: values.question?.trim() ?? "",
      existing_question_image_keys: existing?.existing_question_image_keys ?? [],
      question_image_files: questionImageFiles,

      option1: optionCount >= 1 ? values.option1?.trim() ?? "" : "",
      existing_option1_image_key:
        optionCount >= 1 ? getExistingOptionKey(existing ?? emptyQuestion(), 1) : null,
      option1_image_file: optionCount >= 1
        ? getSelectedOptionFiles(values, 1)[0] ?? null
        : null,

      option2: optionCount >= 2 ? values.option2?.trim() ?? "" : "",
      existing_option2_image_key:
        optionCount >= 2 ? getExistingOptionKey(existing ?? emptyQuestion(), 2) : null,
      option2_image_file: optionCount >= 2
        ? getSelectedOptionFiles(values, 2)[0] ?? null
        : null,

      option3: optionCount >= 3 ? values.option3?.trim() ?? "" : "",
      existing_option3_image_key:
        optionCount >= 3 ? getExistingOptionKey(existing ?? emptyQuestion(), 3) : null,
      option3_image_file: optionCount >= 3
        ? getSelectedOptionFiles(values, 3)[0] ?? null
        : null,

      option4: optionCount >= 4 ? values.option4?.trim() ?? "" : "",
      existing_option4_image_key:
        optionCount >= 4 ? getExistingOptionKey(existing ?? emptyQuestion(), 4) : null,
      option4_image_file: optionCount >= 4
        ? getSelectedOptionFiles(values, 4)[0] ?? null
        : null,

      option5: optionCount >= 5 ? values.option5?.trim() ?? "" : "",
      existing_option5_image_key:
        optionCount >= 5 ? getExistingOptionKey(existing ?? emptyQuestion(), 5) : null,
      option5_image_file: optionCount >= 5
        ? getSelectedOptionFiles(values, 5)[0] ?? null
        : null,

      option6: optionCount >= 6 ? values.option6?.trim() ?? "" : "",
      existing_option6_image_key:
        optionCount >= 6 ? getExistingOptionKey(existing ?? emptyQuestion(), 6) : null,
      option6_image_file: optionCount >= 6
        ? getSelectedOptionFiles(values, 6)[0] ?? null
        : null,

      correct_option: values.correct_option,
      marks: values.marks,
      question_order: values.question_order,
      is_active: values.is_active,
    };

    onSave(nextQuestion);
    onCancelEdit();
  };

  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-green-700">
            {editingQuestion ? "Edit Question" : "Add Question"}
          </h2>
          <p className="text-xs text-muted-foreground">
            Text and image fields are optional. Images are uploaded as files with the exam request.
          </p>
        </div>

        {editingQuestion && (
          <Button type="button" variant="outline" onClick={onCancelEdit}>
            <X className="mr-2 h-4 w-4" />
            Cancel Edit
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">Question Type</label>
          <Select
            value={questionTypeId > 0 ? String(questionTypeId) : ""}
            onValueChange={(value) => setValue("question_type_id", Number(value), { shouldValidate: true })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select question type" />
            </SelectTrigger>
            <SelectContent searchable searchPlaceholder="Search question type...">
              {questionTypes.map((type) => (
                <SelectItem key={type.id} value={String(type.id)}>
                  {type.question_type} ({type.options} options)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.question_type_id && (
            <p className="mt-1 text-xs text-red-500">{errors.question_type_id.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Question</label>
          <Textarea
            {...register("question")}
            placeholder="Enter question text (optional if using image)"
            rows={4}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Question Images</label>
          <Input
            type="file"
            accept="image/*"
            multiple
            {...register("question_images")}
          />
          {editingQuestion && editingQuestion.existing_question_image_keys.length > 0 && (
            <p className="mt-1 text-xs text-muted-foreground">
              Existing images: {editingQuestion.existing_question_image_keys.length}. Selecting new files adds/replaces uploaded files according to backend handling.
            </p>
          )}
        </div>

        {selectedType && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Options</h3>
            {Array.from({ length: optionCount }, (_, index) => (index + 1) as OptionNumber).map(
              (number) => {
                const optionText = `option${number}` as const;
                const optionImage = `option${number}_image` as const;
                const existingKey = editingQuestion
                  ? getExistingOptionKey(editingQuestion, number)
                  : null;

                return (
                  <div key={number} className="rounded-md border p-3">
                    <label className="mb-2 block text-sm font-medium">
                      Option {String.fromCharCode(64 + number)} Text
                    </label>
                    <Input
                      {...register(optionText)}
                      placeholder={`Enter option ${String.fromCharCode(64 + number)} text (optional if using image)`}
                    />

                    <label className="mb-2 mt-3 block text-sm font-medium">
                      Option {String.fromCharCode(64 + number)} Image
                    </label>
                    <Input
                      type="file"
                      accept="image/*"
                      {...register(optionImage)}
                    />
                    {existingKey && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Existing image is attached to this option.
                      </p>
                    )}
                  </div>
                );
              },
            )}
          </div>
        )}

        {selectedType && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium">Correct Option</label>
              <Select
                value={String(correctOption)}
                onValueChange={(value) => setValue("correct_option", Number(value), { shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select correct option" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: optionCount }, (_, index) => index + 1).map((number) => (
                    <SelectItem key={number} value={String(number)}>
                      Option {String.fromCharCode(64 + number)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.correct_option && (
                <p className="mt-1 text-xs text-red-500">{errors.correct_option.message}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Marks</label>
              <Input
                type="number"
                min={0.01}
                step="0.01"
                {...register("marks", { valueAsNumber: true })}
              />
              {errors.marks && (
                <p className="mt-1 text-xs text-red-500">{errors.marks.message}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Question Order</label>
              <Input
                type="number"
                min={1}
                {...register("question_order", { valueAsNumber: true })}
              />
              {errors.question_order && (
                <p className="mt-1 text-xs text-red-500">{errors.question_order.message}</p>
              )}
            </div>
          </div>
        )}

        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("is_active")} />
          <span className="text-sm font-medium">Active Question</span>
        </label>

        <Button
          type="button"
          onClick={handleSubmit(submit)}
          className="w-full bg-orange-500 hover:bg-orange-600"
        >
          {editingQuestion ? (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Save Question Changes
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add Question
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function emptyQuestion(): FrontendQuestion {
  return {
    localId: "",
    question_type_id: 0,
    question: "",
    existing_question_image_keys: [],
    question_image_files: [],
    option1: "",
    existing_option1_image_key: null,
    option1_image_file: null,
    option2: "",
    existing_option2_image_key: null,
    option2_image_file: null,
    option3: "",
    existing_option3_image_key: null,
    option3_image_file: null,
    option4: "",
    existing_option4_image_key: null,
    option4_image_file: null,
    option5: "",
    existing_option5_image_key: null,
    option5_image_file: null,
    option6: "",
    existing_option6_image_key: null,
    option6_image_file: null,
    correct_option: 1,
    marks: 1,
    question_order: 1,
    is_active: true,
  };
}
