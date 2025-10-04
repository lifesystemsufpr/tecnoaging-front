export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/backend';

export const API_ROUTES = {
  LOGIN: `${API_BASE_URL}/auth/login`,

  // Researcher
  RESEARCHERS: `${API_BASE_URL}/researcher`,
  RESEARCHER_BY_ID: (id: string) => `${API_BASE_URL}/researcher/${id}`,

  // Patient
  PATIENTS: `${API_BASE_URL}/patient`,
  PATIENT_BY_ID: (id: string) => `${API_BASE_URL}/patient/${id}`,

  // Health Professional
  HEALTH_PROFESSIONALS: `${API_BASE_URL}/health-professional`,
  HEALTH_PROFESSIONAL_BY_ID: (id: string) =>
    `${API_BASE_URL}/health-professional/${id}`,

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
} as const;
