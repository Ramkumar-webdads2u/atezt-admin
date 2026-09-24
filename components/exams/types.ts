export interface ExamFormPageProps {
  mode: "create" | "edit";
  examId?: number;
}

export interface Category {
  id: number;
  exam: string;
  description?: string;
  duration_minutes?: number;
  total_marks?: number;
}

export interface Coupon {
  id: number;
  coupon_name: string;
  coupon_code: string;
  description?: string;
  percentage?: number;
  valid_from?: string;
  valid_until?: string;
  usage_limit?: number;
  used_count?: number;
}

export interface QuestionType {
  id: number;
  question_type: string;
  options: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ExamData {
  id: number;
  exam_name: string;
  description: string | null;
  price: number;
  duration_minutes: number;
  total_marks: number;
  pass_mark: number;
  max_attempts: number;
  review_cost: number;
  created_at?: string;
  category_id: number | null;
  coupon_id: number | null;
  is_active: boolean;
  total_questions: number;
  question_summary?: QuestionSummary[];
}

export interface QuestionSummary {
  id?: number;
  question_type_id: number;
  question_count?: number;
  question_per_person: number;
  marks_per_question: number;
  total_marks?: number;
}

export interface ExamResponse {
  success: boolean;
  message: string;
  data?: ExamData;
}

export interface ExamFormDataResponse {
  success: boolean;
  message: string;
  exam_categories?: Category[];
  coupons?: Coupon[];
}

export interface QuestionTypesResponse {
  success: boolean;
  message: string;
  data: {
    counts: {
      total: number;
      active: number;
      inactive: number;
    };
    total_records: number;
    data: QuestionType[];
  };
}

export interface ApiExamQuestion {
  id: number;
  question_type_id: number;
  question: string | null;
  question_image: string[] | null;
  option1: string | null;
  option1_image: string | null;
  option2: string | null;
  option2_image: string | null;
  option3: string | null;
  option3_image: string | null;
  option4: string | null;
  option4_image: string | null;
  option5: string | null;
  option5_image: string | null;
  option6: string | null;
  option6_image: string | null;
  correct_option: number;
  marks: number;
  question_order: number | null;
  is_active: boolean;
  created_at?: string;
}

export interface ExamQuestionsResponse {
  success: boolean;
  message: string;
  page: number;
  page_size: number;
  total_records: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
  data: ApiExamQuestion[];
}

export interface FrontendQuestion {
  localId: string;
  id?: number;
  question_type_id: number;
  question: string;

  // Existing server-side image keys are kept internally for edit/update.
  existing_question_image_keys: string[];
  question_image_files: File[];

  option1: string;
  existing_option1_image_key: string | null;
  option1_image_file: File | null;

  option2: string;
  existing_option2_image_key: string | null;
  option2_image_file: File | null;

  option3: string;
  existing_option3_image_key: string | null;
  option3_image_file: File | null;

  option4: string;
  existing_option4_image_key: string | null;
  option4_image_file: File | null;

  option5: string;
  existing_option5_image_key: string | null;
  option5_image_file: File | null;

  option6: string;
  existing_option6_image_key: string | null;
  option6_image_file: File | null;

  correct_option: number;
  marks: number;
  question_order: number;
  is_active: boolean;
}

/**
 * JSON metadata that accompanies the multipart request.
 * New images are sent as File objects in FormData, never as image keys.
 */
export interface ExamQuestionMetadata {
  id?: number;
  question_type_id: number;
  question: string | null;
  question_image_keys: string[] | null;
  option1: string | null;
  option1_image_key: string | null;
  option2: string | null;
  option2_image_key: string | null;
  option3: string | null;
  option3_image_key: string | null;
  option4: string | null;
  option4_image_key: string | null;
  option5: string | null;
  option5_image_key: string | null;
  option6: string | null;
  option6_image_key: string | null;
  correct_option: number;
  marks: number;
  question_order: number;
  is_active: boolean;
}

export interface ExamQuestionsPayload {
  questions: ExamQuestionMetadata[];
}
