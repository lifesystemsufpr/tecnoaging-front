import { PatientQuestionnaireResponseList } from "@/types/api/Questionnaire";
import { fetchClient } from "./api-client";
import { API_ROUTES } from "./Routes";

export async function fetchPatientQuestionnaires(
  patientId: string,
  access_token?: string
): Promise<PatientQuestionnaireResponseList> {
  try {
    const resp = await fetchClient(
      API_ROUTES.QUESTIONNAIRES_BY_PATIENT_ID(patientId),
      {
        method: "GET",
        token: access_token,
      }
    );
    return resp;
  } catch (error) {
    console.error("Error fetching patient questionnaires:", error);
    throw new Error("Failed to fetch patient questionnaires");
  }
}
