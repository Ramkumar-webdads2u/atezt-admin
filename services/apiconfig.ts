const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://192.168.1.35:8000/v1";

// for url dont use tunnel or third party because it takes more time to trigger the api
// Frontend -> localhost:3000 -> localhost:5000 -> Backend
// Frontend -> localhost:3000 -> Internet/network -> Dev Tunnel gateway -> Tunnel connection -> Your computer -> localhost:5000 -> Backend

export const APIURLS = {
  baseUrl: BASE_URL.endsWith("/") ? BASE_URL : `${BASE_URL}/`,
  imageUrl: BASE_URL,
};

export const APPCONFIG = {
  name: "ATEZT - Admin Panel",
  appMode: process.env.NODE_ENV || "development",
};

export const APICONSTANT = {
  // =========================
  // AUTHENTICATION
  // =========================
  Login: "super-admin/login",
  RefreshToken: "super-admin/refresh",

  // =========================
  // DASHBOARD
  // =========================
  Dashboard: "dashboard/",
  RecentResults: "dashboard/dashboard/recent-results",

  // =========================
  // EXAM CATEGORIES
  // =========================
  CreateExamCategory: "exam-categories/",
  GetExamCategories: "exam-categories/",
  GetExamCategory: "exam-categories/{category_id}",
  UpdateExamCategory: "exam-categories/{category_id}",
  DeleteExamCategory: "exam-categories/{category_id}",

  // =========================
  // COUPONS
  // =========================
  CreateCoupon: "coupons/",
  GetCoupons: "coupons/",
  GetCoupon: "coupons/{coupon_id}",
  UpdateCoupon: "coupons/{coupon_id}",
  DeleteCoupon: "coupons/{coupon_id}",

  // =========================
  // QUESTION TYPES
  // =========================
  CreateQuestionType: "question-types/question-types",
  GetQuestionTypes: "question-types/question-types",
  GetQuestionType: "question-types/question-types/{question_type_id}",
  UpdateQuestionType: "question-types/question-types/{question_type_id}",
  DeleteQuestionType: "question-types/question-types/{question_type_id}",

  // =========================
  // EXAMS
  // =========================
  CreateExam: "exams/",
  GetExams: "exams/",
  CreateExamQuestions: "exams/{exam_id}/questions",
  UpdateExamQuestions: "exams/{exam_id}/questions",
  GetExamQuestions: "exams/{exam_id}/questions",
  UpdateExam: "exams/{exam_id}",
  GetExam: "exams/{exam_id}",
  DeleteExam: "exams/{exam_id}",
  UpdateExamStatus: "exams/{exam_id}/status",
  ValidateQuestionImport: "exams/questions/validate",
  GetExamFormData: "exams/fields/form-data",

  // =========================
  // ADMIN USERS
  // =========================
  GetAdminUsers: "admin-users/",
  UpdateAdminUser: "admin-users/{user_id}",
  DeleteAdminUser: "admin-users/{user_id}",
  UpdateAdminUserStatus: "admin-users/{user_id}/status",
  // GetUserExamDetails: "admin-users/{user_id}/exam-details",
  GetUserExamDetails: "admin-users/exam-details/",

  // =========================
  // RESULTS
  // =========================
  GetResults: "results/",
  ExportResults: "results/export",
} as const;

export type APIKeys = keyof typeof APICONSTANT;
