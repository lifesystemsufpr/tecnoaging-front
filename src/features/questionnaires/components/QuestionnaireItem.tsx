import { Box, Card, CardContent, Typography } from "@mui/material";
import { PatientQuestionnaire } from "../types/domain";
import { getBadgeStyles, getSeverityColor } from "../utils/color";

export default function QuestionnaireItem({
  item,
}: {
  item: PatientQuestionnaire;
}) {
  const barColor = getSeverityColor(item.classification);
  const badgeStyle = getBadgeStyles(item.classification);

  return (
    <Card
      sx={{
        mb: 2,
        borderLeft: `10px solid ${barColor}`,
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {item.questionnaire.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pontuação total: <strong>{item.totalScore}</strong>
            </Typography>
          </Box>

          <Box
            sx={{
              ...badgeStyle,
              border: "1px solid",
              borderRadius: "16px",
              px: 2,
              py: 0.5,
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: "bold" }}>
              {item.classification}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 3,
            pt: 2,
            borderTop: "1px solid #eee",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Aplicado por: {item.healthProfessional.user.fullName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(item.date).toLocaleDateString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
