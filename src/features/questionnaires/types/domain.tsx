export type Classification =
  | "Frágil"
  | "Potencialmente Frágil"
  | "Em Risco de Fragilização"
  | "Robusto";

export interface UserBasicInfo {
  fullName: string;
}

export interface HealthProfessionalInfo {
  user: UserBasicInfo;
}

export interface QuestionnaireInfo {
  title: string;
}

export interface QuestionInfo {
  statement: string;
}

export interface SelectedOptionInfo {
  label: string;
  score: number;
}

export interface Answer {
  id: string;
  questionnaireResponseId: string;
  questionId: string;
  selectedOptionId: string | null;
  valueText: string | null;
  question: QuestionInfo;
  selectedOption: SelectedOptionInfo | null;
}

export interface PatientQuestionnaire {
  id: string;
  totalScore: number;
  classification: Classification;
  date: string;
  createdAt: string;
  healthProfessional: HealthProfessionalInfo;
  questionnaire: QuestionnaireInfo;
  answers: Answer[];
}

export interface QuestionnaireListItem {
  id: string;
  date: string;
  totalScore: number;
  classification: Classification;
  questionnaireTitle: string;
  questionnaireSlug: string;
  participantId: string;
  participantName: string;
  participantCpf: string;
  healthProfessionalId: string;
  healthProfessionalName: string;
  healthProfessionalSpeciality: string;
}

export type PatientQuestionnaireList = PatientQuestionnaire[];
export type QuestionnaireList = QuestionnaireListItem[];
