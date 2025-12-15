import { PatientQuestionnaire } from "../domain/Questionnaire";


export interface PatientQuestionnaireResponse extends PatientQuestionnaire {
  participantId: string;
  healthProfessionalId: string;
  questionnaireId: string;
  updatedAt: string;
}

export type PatientQuestionnaireResponseList = PatientQuestionnaireResponse[];