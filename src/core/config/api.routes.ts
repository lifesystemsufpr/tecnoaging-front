const FALLBACK_API_BASE_URL = "http://127.0.0.1:3333";

const normalizeBaseUrl = (url?: string) => {
  const candidate = url?.trim();

  if (!candidate) return FALLBACK_API_BASE_URL;

  try {
    const parsed = new URL(candidate);
    const host =
      parsed.hostname === "localhost" ? "127.0.0.1" : parsed.hostname;
    const port = parsed.port ? `:${parsed.port}` : "";

    const pathname =
      parsed.pathname && parsed.pathname !== "/"
        ? parsed.pathname.replace(/\/$/, "")
        : "";

    return `${parsed.protocol}//${host}${port}${pathname}`;
  } catch {
    const sanitized = candidate.replace(/\/$/, "");
    return sanitized || FALLBACK_API_BASE_URL;
  }
};

export const API_BASE_URL = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.API_BASE_URL ??
  FALLBACK_API_BASE_URL
);

export const API_ROUTES = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REFRESH: `${API_BASE_URL}/auth/refresh-token`,

  // Researcher
  RESEARCHERS: `${API_BASE_URL}/researcher`,
  RESEARCHER_BY_ID: (id: string) => `${API_BASE_URL}/researcher/${id}`,

  // Patient
  PARTICIPANTS: `${API_BASE_URL}/participant`,
  PARTICIPANT_BY_ID: (id: string) => `${API_BASE_URL}/participant/${id}`,

  // Health Professional
  HEALTH_PROFESSIONALS: `${API_BASE_URL}/health-professional`,
  HEALTH_PROFESSIONAL_BY_ID: (id: string) =>
    `${API_BASE_URL}/health-professional/${id}`,
  HEALTH_PROFESSIONAL_DASHBOARD_STATS: () =>
    `${API_BASE_URL}/evaluation/dashboard/summary`,

  // Institution
  INSTITUTIONS: `${API_BASE_URL}/institution`,
  INSTITUTION_BY_ID: (id: string) => `${API_BASE_URL}/institution/${id}`,

  // Field of Study
  FIELDS_OF_STUDY: `${API_BASE_URL}/field-of-study`,
  FIELD_OF_STUDY_BY_ID: (id: string) => `${API_BASE_URL}/field-of-study/${id}`,

  // Specialization
  SPECIALIZATIONS: `${API_BASE_URL}/specialization`,
  SPECIALIZATION_BY_ID: (id: string) => `${API_BASE_URL}/specialization/${id}`,

  // Health Unit
  HEALTH_UNITS: `${API_BASE_URL}/health-unit`,
  HEALTH_UNIT_BY_ID: (id: string) => `${API_BASE_URL}/health-unit/${id}`,

  // Evaluation
  EVALUATIONS: `${API_BASE_URL}/evaluation`,
  EVALUATION_BY_ID: (id: string) => `${API_BASE_URL}/evaluation/${id}`,
  EVALUATION_DETAILED_BY_ID: (id: string) =>
    `${API_BASE_URL}/evaluation/${id}/detailed`,
  EVALUATION_REPETITIONS_HISTORY: (id: string) =>
    `${API_BASE_URL}/evaluation/${id}/repetitions/history`,
  EVALUATION_PROCESS_PENDING: (id: string) =>
    `${API_BASE_URL}/evaluation/${id}/process-pending`,

  QUESTIONNAIRES: `${API_BASE_URL}/questionnaire`,
  QUESTIONNAIRES_BY_PATIENT_ID: (patientId: string) =>
    `${API_BASE_URL}/questionnaires/participant/${patientId}`,

  // Manager
  MANAGERS: `${API_BASE_URL}/manager`,
  MANAGER_BY_ID: (id: string) => `${API_BASE_URL}/manager/${id}`,

  PARTICIPANT_DASHBOARDS: {
    EVALUATION_COUNT: `${API_BASE_URL}/dashboard/participant/evaluations-count`,
    AVARAGE_DURATION: `${API_BASE_URL}/dashboard/participant/average-duration`,
    MONTHLY_EVALUATIONS: `${API_BASE_URL}/dashboard/participant/monthly-evaluations`,
    MOST_PERFORMED_EVALUATIONS: `${API_BASE_URL}/dashboard/participant/most-performed-tests`,
    MONTHLY_AVERAGE: `${API_BASE_URL}/dashboard/participant/monthly-average`,
  },

  RESEARCHER_DASHBOARDS: {
    SUMMARY: `${API_BASE_URL}/dashboard/advanced/summary`,
    MONTHLY_HISTORY: `${API_BASE_URL}/dashboard/advanced/monthly-history`,
    AVARAGE_TEST_BY_AGE_GROUP: `${API_BASE_URL}/dashboard/advanced/average-test-by-age-group`,
    POPULATION: `${API_BASE_URL}/researcher/population`
  },
} as const;
