"use client";

import { useState } from "react";
import { Download, Upload } from "lucide-react";
import * as XLSX from "xlsx";

import { Button } from "@/components/ui/button";
import type { FrontendQuestion, QuestionType } from "./types";

interface Props {
  questionTypes: QuestionType[];
  onImport: (questions: FrontendQuestion[]) => void;
}

const MAX_EXCEL_ROWS = 100;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

type ExcelRow = Record<string, unknown>;

function normalize(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

function toText(value: unknown): string {
  return String(value ?? "").trim();
}

function toNumber(value: unknown, fallback: number): number {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return parsed;
}

function createEmptyQuestion(
  index: number,
  type: QuestionType,
  row: ExcelRow,
  options: string[],
  correctOption: number,
): FrontendQuestion {
  return {
    localId: crypto.randomUUID(),

    question_type_id: type.id,

    question: toText(row.question),

    existing_question_image_keys: [],
    question_image_files: [],

    option1: options[0] ?? "",
    existing_option1_image_key: null,
    option1_image_file: null,

    option2: options[1] ?? "",
    existing_option2_image_key: null,
    option2_image_file: null,

    option3: options[2] ?? "",
    existing_option3_image_key: null,
    option3_image_file: null,

    option4: options[3] ?? "",
    existing_option4_image_key: null,
    option4_image_file: null,

    option5: options[4] ?? "",
    existing_option5_image_key: null,
    option5_image_file: null,

    option6: options[5] ?? "",
    existing_option6_image_key: null,
    option6_image_file: null,

    correct_option: correctOption,

    marks: toNumber(row.marks, 1) || 1,

    question_order: index + 1,

    is_active: true,
  };
}

export default function ExamExcelImport({
  questionTypes,
  onImport,
}: Props) {
  const [fileName, setFileName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isImporting, setIsImporting] = useState<boolean>(false);

  /* =========================================================
     DOWNLOAD DEMO FILE
  ========================================================= */

  const downloadDemoFile = () => {
    const demoData = [
      {
        question: "Which planet is known as the Red Planet?",
        question_type: "choose_best",
        answer: "Mars",
        option1: "Venus",
        option2: "Mars",
        option3: "Earth",
        option4: "Jupiter",
        option5: "Saturn",
        option6: "Neptune",
        marks: 2,
      },
      {
        question: "Is the Sun a star?",
        question_type: "true_false",
        answer: "True",
        option1: "True",
        option2: "False",
        option3: "",
        option4: "",
        option5: "",
        option6: "",
        marks: 1,
      },
      {
        question: "What is 12 + 8?",
        question_type: "decimal",
        answer: "20",
        option1: "18",
        option2: "20",
        option3: "22",
        option4: "24",
        option5: "",
        option6: "",
        marks: 1,
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(demoData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "DemoQuestions",
    );

    XLSX.writeFile(
      workbook,
      "exam_question_bulk_demo.xlsx",
    );
  };

  /* =========================================================
     HANDLE EXCEL FILE
  ========================================================= */

  const handleFile = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setFileName("");

    if (!file.name.toLowerCase().endsWith(".xlsx")) {
      setError("Please select an .xlsx file.");

      event.target.value = "";

      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Excel file must be 10MB or smaller.");

      event.target.value = "";

      return;
    }

    setIsImporting(true);

    try {
      const buffer = await file.arrayBuffer();

      const workbook = XLSX.read(buffer, {
        type: "array",
      });

      const sheetName = workbook.SheetNames[0];

      if (!sheetName) {
        setError("The Excel file has no worksheet.");

        return;
      }

      const worksheet = workbook.Sheets[sheetName];

      if (!worksheet) {
        setError("Unable to read the first worksheet.");

        return;
      }

      const rows =
        XLSX.utils.sheet_to_json<ExcelRow>(
          worksheet,
          {
            defval: "",
          },
        );

      /* =====================================================
         MAXIMUM 100 QUESTIONS
      ===================================================== */

      if (rows.length === 0) {
        setError(
          "The Excel file does not contain any question data.",
        );

        return;
      }

      if (rows.length > MAX_EXCEL_ROWS) {
        setError(
          `Maximum ${MAX_EXCEL_ROWS} questions are allowed per Excel file. This file contains ${rows.length} questions.`,
        );

        return;
      }

      const imported: FrontendQuestion[] = [];

      const invalidRows: string[] = [];

      /* =====================================================
         PROCESS EACH ROW
      ===================================================== */

      rows.forEach(
        (
          row: ExcelRow,
          index: number,
        ) => {
          const excelRowNumber = index + 2;

          const question = toText(
            row.question,
          );

          const typeName = normalize(
            row.question_type,
          );

          /* -----------------------------------------------
             QUESTION REQUIRED
          ----------------------------------------------- */

          if (!question) {
            invalidRows.push(
              `Row ${excelRowNumber}: question is required.`,
            );

            return;
          }

          /* -----------------------------------------------
             QUESTION TYPE
          ----------------------------------------------- */

          const type =
            questionTypes.find(
              (
                item: QuestionType,
              ) =>
                normalize(
                  item.question_type,
                ) === typeName,
            );

          if (!type) {
            invalidRows.push(
              `Row ${excelRowNumber}: invalid question_type "${toText(
                row.question_type,
              )}".`,
            );

            return;
          }

          /* -----------------------------------------------
             DYNAMIC OPTIONS
          ----------------------------------------------- */

          const options = Array.from(
            {
              length: type.options,
            },
            (
              _: unknown,
              optionIndex: number,
            ) =>
              toText(
                row[
                  `option${
                    optionIndex + 1
                  }`
                ],
              ),
          );

          /* -----------------------------------------------
             CHECK REQUIRED OPTIONS
          ----------------------------------------------- */

          const missingOption =
            options.some(
              (
                option: string,
              ) => !option,
            );

          if (missingOption) {
            invalidRows.push(
              `Row ${excelRowNumber}: all ${type.options} options are required for "${type.question_type}".`,
            );

            return;
          }

          /* -----------------------------------------------
             ANSWER
          ----------------------------------------------- */

          const answer = normalize(
            row.answer,
          );

          if (!answer) {
            invalidRows.push(
              `Row ${excelRowNumber}: answer is required.`,
            );

            return;
          }

          const matchedIndex =
            options.findIndex(
              (
                option: string,
              ) =>
                normalize(
                  option,
                ) === answer,
            );

          if (matchedIndex === -1) {
            invalidRows.push(
              `Row ${excelRowNumber}: answer "${toText(
                row.answer,
              )}" does not match any option.`,
            );

            return;
          }

          const correctOption =
            matchedIndex + 1;

          /* -----------------------------------------------
             CREATE FRONTEND QUESTION
          ----------------------------------------------- */

          imported.push(
            createEmptyQuestion(
              index,
              type,
              row,
              options,
              correctOption,
            ),
          );
        },
      );

      /* =====================================================
         VALIDATION ERRORS
      ===================================================== */

      if (invalidRows.length > 0) {
        const previewErrors =
          invalidRows
            .slice(0, 5)
            .join(" ");

        const remaining =
          invalidRows.length > 5
            ? ` And ${
                invalidRows.length - 5
              } more errors.`
            : "";

        setError(
          `${invalidRows.length} row(s) could not be imported. ${previewErrors}${remaining}`,
        );

        return;
      }

      /* =====================================================
         SUCCESS
      ===================================================== */

      if (imported.length === 0) {
        setError(
          "No valid questions were imported.",
        );

        return;
      }

      setFileName(file.name);

      onImport(imported);
    } catch (error) {
      console.error(
        "EXCEL IMPORT ERROR:",
        error,
      );

      setError(
        "Unable to read the Excel file. Please check that it is a valid .xlsx file.",
      );
    } finally {
      setIsImporting(false);

      event.target.value = "";
    }
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm">
      {/* HEADER */}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-green-700">
            Import Questions from Excel
          </h2>

          <p className="text-xs text-muted-foreground">
            Upload up to 100 questions at once.
          </p>
        </div>

        <Button
          type="button"
          size="sm"
          onClick={downloadDemoFile}
          disabled={isImporting}
        >
          <Download className="mr-2 h-4 w-4" />

          Demo File
        </Button>
      </div>

      {/* UPLOAD */}

      <label
        htmlFor="exam-question-excel"
        className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 px-5 text-center transition hover:border-orange-400 hover:bg-orange-50"
      >
        <Upload className="mb-2 h-6 w-6 text-orange-500" />

        <span className="text-orange-500">
          {isImporting
            ? "Reading Excel file..."
            : "Choose an Excel (.xlsx) file"}
        </span>

        <span className="mt-1 text-sm text-gray-400">
          Maximum 100 questions • Maximum 10MB
        </span>
      </label>

      <input
        id="exam-question-excel"
        type="file"
        accept=".xlsx"
        className="hidden"
        onChange={handleFile}
        disabled={isImporting}
      />

      {/* FILE NAME */}

      {fileName && !error && (
        <p className="mt-3 text-sm text-green-600">
          Successfully imported:{" "}
          <span className="font-medium">
            {fileName}
          </span>
        </p>
      )}

      {/* ERROR */}

      {error && (
        <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}