'use client'

import { fetchPatientQuestionnaires } from "@/services/api-questionnaires";
import { classification, PatientQuestionnaire, PatientQuestionnaireList } from "@/types/domain/Questionnaire";
import { Box, Card, CardContent, Typography } from "@mui/material"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";
import { toast } from "sonner";

const getSeverityColor = (status: classification) => {
    switch (status) {
        case "Em Risco de Fragilização":
        case "Potencialmente Frágil":
            return '#FF9800';
        case "Frágil":
            return '#D32F2F'; 
        case "Robusto":
            return '#4CAF50'; 
        default:
            return '#BDBDBD'; 
    }
}

const getBadgeStyles = (status: classification) => {
    switch (status) {
        case "Em Risco de Fragilização":
        case "Potencialmente Frágil":
            return { backgroundColor: '#FFF3E0', color: '#E65100', borderColor: '#FFB74D' };
        case "Frágil":
            return { backgroundColor: '#FFEBEE', color: '#C62828', borderColor: '#EF9A9A' };
        case "Robusto":
            return { backgroundColor: '#E8F5E9', color: '#2E7D32', borderColor: '#81C784' };
        default:
            return { backgroundColor: '#F5F5F5', color: '#616161', borderColor: '#E0E0E0' };
    }
}

function QuestionnaireItem({ item }: { item: PatientQuestionnaire }) {

    const barColor = getSeverityColor(item.classification);
    const badgeStyle = getBadgeStyles(item.classification);

    return (
        <Card 
            sx={{ 
                mb: 2, 
                borderLeft: `10px solid ${barColor}`, 
                borderRadius: 2,
                boxShadow: 2 
            }}
        >
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {item.questionnaire.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Pontuação total: <strong>{item.totalScore}</strong>
                        </Typography>
                    </Box>

                    <Box sx={{ 
                        ...badgeStyle, 
                        border: '1px solid',
                        borderRadius: '16px', 
                        px: 2, 
                        py: 0.5 
                    }}>
                        <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                            {item.classification}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, pt: 2, borderTop: '1px solid #eee' }}>               
                    <Typography variant="caption" color="text.secondary">
                        Aplicado por: {item.healthProfessional.user.fullName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {new Date(item.date).toLocaleDateString()}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    )
}

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
        return <Box sx={{ p: 4 }}>Carregando questionários...</Box>;
    }

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>Histórico de Questionários</Typography>
            {questionnaires.map((q) => (
                <QuestionnaireItem key={q.id} item={q} />
            ))}
        </Box>
    )
}