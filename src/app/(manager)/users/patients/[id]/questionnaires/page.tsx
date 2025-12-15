'use client'

import { fetchPatientQuestionnaires } from "@/services/api-questionnaires";
import { PatientQuestionnaireList } from "@/types/domain/Questionnaire";
import { Box } from "@mui/material"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PatientQuestionnairesPage() {
    const params = useParams();
    const patientId = params.id as string;

    const [questionnaires, setQuestionnaires] = useState<PatientQuestionnaireList>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const loadQuestionnaires = async () => {
        setLoading(true);
        try {
            const resp = await fetchPatientQuestionnaires(patientId);
            setQuestionnaires(resp);
        } catch (error) {
            toast.error("Failed to load patient questionnaires");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadQuestionnaires();
    }, [patientId]);

    if (loading) {
        return <Box>Loading...</Box>;
    }

    return (
        <Box>
            Patient Questionnaires Page
            {questionnaires.map((q) => (
                <Box key={q.id} mb={2} p={2} border="1px solid #ccc" borderRadius="8px">
                    <h3>{q.questionnaire.title}</h3>
                    <p>Total Score: {q.totalScore}</p>
                    <p>Classification: {q.classification}</p>
                    <p>Date: {new Date(q.date).toLocaleDateString()}</p>
                    <p>Health Professional: {q.healthProfessional.user.fullName}</p>
                </Box>
            ))}
        </Box>
    )
}