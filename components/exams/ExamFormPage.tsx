"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import useReactQuery from "@/hooks/useReactQuery";
import useApiMutation from "@/hooks/Mutations/useApiMutation";
import axios from "@/services/axiosInstance";
import { APICONSTANT } from "@/services/apiconfig";

import ExamDetailsForm, { type ExamFormValues } from "./ExamDetailsForm";
import ExamQuestionBuilder from "./ExamQuestionBuilder";
import ExamQuestionList from "./ExamQuestionList";
import ExamExcelImport from "./ExamExcelImport";
import ExamSummary from "./ExamSummary";
import type {
  ExamFormPageProps,
  ExamFormDataResponse,
  ExamResponse,
  ExamQuestionsResponse,
  QuestionTypesResponse,
  FrontendQuestion,
  ExamQuestionMetadata,
} from "./types";

const questionSummarySchema = z.object({
  question_type_id: z.number().int().positive(),
  question_per_person: z.number().int().min(1),
  marks_per_question: z.number().positive(),
});

const examSchema = z.object({
  exam_name: z.string().trim().min(1, "Exam name is required"),
  description: z.string().optional(),
  price: z.number().min(0),
  category_id: z.number().int().positive("Exam category is required"),
  coupon_id: z.number().int().positive().nullable(),
  pass_mark: z.number().min(0),
  max_attempts: z.number().int().min(1),
  duration_minutes: z.number().int().min(1),
  review_cost: z.number().min(0),
  is_active: z.boolean(),
  question_summary: z.array(questionSummarySchema).min(1, "At least one question summary is required"),
});

const defaultValues: ExamFormValues = {
  exam_name: "",
  description: "",
  price: 0,
  category_id: 0,
  coupon_id: null,
  pass_mark: 0,
  max_attempts: 1,
  duration_minutes: 60,
  review_cost: 0,
  is_active: true,
  question_summary: [],
};

function apiQuestionToFrontend(question: ExamQuestionsResponse["data"][number]): FrontendQuestion {
  return {
    localId: `server-${question.id}`,
    id: question.id,
    question_type_id: question.question_type_id,
    question: question.question ?? "",
    existing_question_image_keys: question.question_image ?? [],
    question_image_files: [],
    option1: question.option1 ?? "",
    existing_option1_image_key: question.option1_image,
    option1_image_file: null,
    option2: question.option2 ?? "",
    existing_option2_image_key: question.option2_image,
    option2_image_file: null,
    option3: question.option3 ?? "",
    existing_option3_image_key: question.option3_image,
    option3_image_file: null,
    option4: question.option4 ?? "",
    existing_option4_image_key: question.option4_image,
    option4_image_file: null,
    option5: question.option5 ?? "",
    existing_option5_image_key: question.option5_image,
    option5_image_file: null,
    option6: question.option6 ?? "",
    existing_option6_image_key: question.option6_image,
    option6_image_file: null,
    correct_option: question.correct_option,
    marks: question.marks,
    question_order: question.question_order ?? 1,
    is_active: question.is_active,
  };
}

function questionToMetadata(question: FrontendQuestion): ExamQuestionMetadata {
  return {
    id: question.id,
    question_type_id: question.question_type_id,
    question: question.question || null,
    question_image_keys:
      question.existing_question_image_keys.length > 0
        ? question.existing_question_image_keys
        : null,
    option1: question.option1 || null,
    option1_image_key: question.existing_option1_image_key,
    option2: question.option2 || null,
    option2_image_key: question.existing_option2_image_key,
    option3: question.option3 || null,
    option3_image_key: question.existing_option3_image_key,
    option4: question.option4 || null,
    option4_image_key: question.existing_option4_image_key,
    option5: question.option5 || null,
    option5_image_key: question.existing_option5_image_key,
    option6: question.option6 || null,
    option6_image_key: question.existing_option6_image_key,
    correct_option: question.correct_option,
    marks: question.marks,
    question_order: question.question_order,
    is_active: question.is_active,
  };
}

/**
 * Build one multipart/form-data request.
 *
 * The `questions` field contains JSON metadata. New image files are appended
 * with indexed names such as `questions[0].question_image` and
 * `questions[0].option1_image` so the backend can associate each file with
 * the matching question.
 */
function buildQuestionsFormData(questions: FrontendQuestion[]): FormData {
  const formData = new FormData();
  const metadata = questions.map(questionToMetadata);

  formData.append("questions", JSON.stringify(metadata));

  questions.forEach((question, index) => {
    question.question_image_files.forEach((file) => {
      formData.append(`questions[${index}].question_image`, file, file.name);
    });

    const optionFiles: Array<{
      number: 1 | 2 | 3 | 4 | 5 | 6;
      file: File | null;
    }> = [
      { number: 1, file: question.option1_image_file },
      { number: 2, file: question.option2_image_file },
      { number: 3, file: question.option3_image_file },
      { number: 4, file: question.option4_image_file },
      { number: 5, file: question.option5_image_file },
      { number: 6, file: question.option6_image_file },
    ];

    optionFiles.forEach(({ number, file }) => {
      if (file) {
        formData.append(`questions[${index}].option${number}_image`, file, file.name);
      }
    });
  });

  return formData;
}

export default function ExamFormPage({ mode, examId }: ExamFormPageProps) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const [questions, setQuestions] = useState<FrontendQuestion[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<FrontendQuestion | null>(null);

  const methods = useForm<ExamFormValues>({
    resolver: zodResolver(examSchema),
    defaultValues,
  });

  const { reset, handleSubmit } = methods;

  const { data: formDataResponse, isLoading: isFormDataLoading } = useReactQuery<ExamFormDataResponse>(
    "GetExamFormData",
    "",
    true,
  );

  const { data: questionTypesResponse, isLoading: isQuestionTypesLoading } = useReactQuery<QuestionTypesResponse>(
    "GetQuestionTypes",
    "",
    true,
  );

  const categories = formDataResponse?.exam_categories ?? [];
  const coupons = formDataResponse?.coupons ?? [];
  const questionTypes = questionTypesResponse?.data?.data ?? [];

  const { data: examResponse, isLoading: isExamLoading, isError: isExamError } = useQuery<ExamResponse>({
    queryKey: ["GetExam", examId],
    enabled: Boolean(isEdit && examId),
    retry: 0,
    queryFn: async () => {
      if (!examId) throw new Error("Exam ID is required");
      const url = APICONSTANT.GetExam.replace("{exam_id}", String(examId));
      const response = await axios.get(url);
      return response.data as ExamResponse;
    },
  });

  const {
    data: examQuestionsResponse,
    isLoading: isExamQuestionsLoading,
    isError: isExamQuestionsError,
  } = useQuery<ExamQuestionsResponse>({
    queryKey: ["GetExamQuestions", examId],
    enabled: Boolean(isEdit && examId),
    retry: 0,
    queryFn: async () => {
      if (!examId) throw new Error("Exam ID is required");
      const url = APICONSTANT.GetExamQuestions.replace("{exam_id}", String(examId));
      const response = await axios.get(url);
      return response.data as ExamQuestionsResponse;
    },
  });

  const createExamMutation = useApiMutation("post");
  const updateExamMutation = useApiMutation("put");
  const createQuestionsMutation = useApiMutation("post");
  const updateQuestionsMutation = useApiMutation("put");

  useEffect(() => {
    if (!isEdit || !examResponse?.data) return;
    const exam = examResponse.data;

    reset({
      exam_name: exam.exam_name ?? "",
      description: exam.description ?? "",
      price: exam.price ?? 0,
      category_id: exam.category_id ?? 0,
      coupon_id: exam.coupon_id ?? null,
      pass_mark: exam.pass_mark ?? 0,
      max_attempts: exam.max_attempts ?? 1,
      duration_minutes: exam.duration_minutes ?? 60,
      review_cost: exam.review_cost ?? 0,
      is_active: exam.is_active ?? true,
      question_summary:
        exam.question_summary?.map((item) => ({
          question_type_id: item.question_type_id,
          question_per_person: item.question_per_person,
          marks_per_question: item.marks_per_question,
        })) ?? [],
    });
  }, [examResponse, isEdit, reset]);

  useEffect(() => {
    if (!isEdit || !examQuestionsResponse?.data) return;
    setQuestions(examQuestionsResponse.data.map(apiQuestionToFrontend));
  }, [examQuestionsResponse, isEdit]);

  const questionCounts = useMemo(
    () => questions.reduce<Record<number, number>>((result, question) => {
      result[question.question_type_id] = (result[question.question_type_id] ?? 0) + 1;
      return result;
    }, {}),
    [questions],
  );

  const addOrUpdateQuestion = (question: FrontendQuestion) => {
    setQuestions((current) => {
      const existingIndex = current.findIndex((item) => item.localId === question.localId);
      if (existingIndex === -1) {
        return [...current, { ...question, question_order: current.length + 1 }];
      }
      const next = [...current];
      next[existingIndex] = question;
      return next.map((item, index) => ({ ...item, question_order: index + 1 }));
    });
    setEditingQuestion(null);
  };

  const deleteQuestion = (localId: string) => {
    setQuestions((current) =>
      current
        .filter((question) => question.localId !== localId)
        .map((question, index) => ({ ...question, question_order: index + 1 })),
    );
    if (editingQuestion?.localId === localId) setEditingQuestion(null);
  };

  const isLoading =
    isFormDataLoading ||
    isQuestionTypesLoading ||
    (isEdit && (isExamLoading || isExamQuestionsLoading));

  const isSaving =
    createExamMutation.isPending ||
    updateExamMutation.isPending ||
    createQuestionsMutation.isPending ||
    updateQuestionsMutation.isPending;

  const submitExam = async (values: ExamFormValues) => {
    try {
      if (!questions.length) {
        throw new Error("Please add at least one question before saving the exam.");
      }

      const examPayload = {
        exam_name: values.exam_name,
        description: values.description?.trim() || null,
        price: values.price,
        category_id: values.category_id,
        coupon_id: values.coupon_id,
        pass_mark: values.pass_mark,
        max_attempts: values.max_attempts,
        duration_minutes: values.duration_minutes,
        review_cost: values.review_cost,
        is_active: values.is_active,
        question_summary: values.question_summary,
      };

      let targetExamId = examId;

      if (!isEdit) {
        const createResponse = await createExamMutation.mutateAsync({
          url: { apiUrl: APICONSTANT.CreateExam },
          body: examPayload,
        });

        if (createResponse?.success !== true) {
          throw new Error(createResponse?.message || "Failed to create exam");
        }

        targetExamId = createResponse?.data?.id as number | undefined;
        if (!targetExamId) throw new Error("Created exam ID was not returned.");
      } else {
        if (!examId) throw new Error("Exam ID is required");

        const updateUrl = APICONSTANT.UpdateExam.replace("{exam_id}", String(examId));
        const updateResponse = await updateExamMutation.mutateAsync({
          url: { apiUrl: updateUrl },
          body: {
            exam_name: examPayload.exam_name,
            description: examPayload.description,
            price: examPayload.price,
            category_id: examPayload.category_id,
            coupon_id: examPayload.coupon_id,
            pass_mark: examPayload.pass_mark,
            max_attempts: examPayload.max_attempts,
            duration_minutes: examPayload.duration_minutes,
            review_cost: examPayload.review_cost,
            is_active: examPayload.is_active,
          },
        });

        if (updateResponse?.success !== true) {
          throw new Error(updateResponse?.message || "Failed to update exam");
        }
      }

      if (!targetExamId) throw new Error("Exam ID is required for questions.");

      const questionsUrl = APICONSTANT.CreateExamQuestions.replace(
        "{exam_id}",
        String(targetExamId),
      );
      const questionsFormData = buildQuestionsFormData(questions);

      const questionResponse = isEdit
        ? await updateQuestionsMutation.mutateAsync({
            url: { apiUrl: questionsUrl },
            body: questionsFormData,
          })
        : await createQuestionsMutation.mutateAsync({
            url: { apiUrl: questionsUrl },
            body: questionsFormData,
          });

      if (questionResponse?.success !== true) {
        throw new Error(questionResponse?.message || "Failed to save questions");
      }

      router.push("/exams");
      router.refresh();
    } catch (error) {
      console.error("SAVE EXAM ERROR:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin" />
      </div>
    );
  }

  if (isEdit && (isExamError || isExamQuestionsError)) {
    return (
      <div className="p-5">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          Failed to load exam details/questions.
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="w-full">
        <div className="flex items-center px-5 py-6">
          <h1 className="text-2xl font-semibold text-green-700">
            {isEdit ? "Edit Exam" : "Create Exam"}
          </h1>
        </div>

        <form onSubmit={handleSubmit(submitExam)} className="space-y-6 px-5 pb-10">
          <ExamDetailsForm categories={categories} coupons={coupons} disabled={isSaving} />

          <ExamExcelImport
            questionTypes={questionTypes}
            onImport={(importedQuestions) => {
              setQuestions((current) => [
                ...current,
                ...importedQuestions.map((question, index) => ({
                  ...question,
                  question_order: current.length + index + 1,
                })),
              ]);
            }}
          />

          <ExamQuestionBuilder
            questionTypes={questionTypes}
            questions={questions}
            editingQuestion={editingQuestion}
            onSave={addOrUpdateQuestion}
            onCancelEdit={() => setEditingQuestion(null)}
          />

          <div className="space-y-3">
            <div>
              <h2 className="text-lg font-semibold text-green-700">Questions ({questions.length})</h2>
              <p className="text-xs text-muted-foreground">Review all questions before saving.</p>
            </div>
            <ExamQuestionList
              questions={questions}
              questionTypes={questionTypes}
              onEdit={setEditingQuestion}
              onDelete={deleteQuestion}
            />
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-green-700">Question Summary</h2>
            <ExamSummary questionTypes={questionTypes} questionCounts={questionCounts} />
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={isSaving || questions.length === 0}
              className="bg-orange-500 px-10 hover:bg-orange-600"
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Update Exam" : "Publish Exam"}
            </Button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
