export type classification = 'Frágil' | 'Potencialmente Frágil' | 'Em Risco de Fragilização' |'Robusto';

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
  classification: classification;
  date: string;
  createdAt: string;
  healthProfessional: HealthProfessionalInfo;
  questionnaire: QuestionnaireInfo;
  answers: Answer[];
}

export type PatientQuestionnaireList = PatientQuestionnaire[];