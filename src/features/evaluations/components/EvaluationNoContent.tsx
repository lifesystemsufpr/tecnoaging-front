import { Card, CardContent, Typography, Button } from "@mui/material";
import { evaluationService } from "../services/evaluation.service";
import { toast } from "sonner";
import { useState } from "react";
import { ApiError } from "@/core/services/api.type";

interface EvaluationNoContentProps {
  evaluationId?: string;
}

export default function EvaluationNoContent({
  evaluationId,
}: EvaluationNoContentProps) {
  const [loading, setLoading] = useState(false);

  const handleReprocessEvaluation = async () => {
    try {
      setLoading(true);
      await evaluationService.processPending(evaluationId!);

      toast.success("Avaliação enviada para reprocessamento com sucesso!");
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(`Erro ${error.status}: ${error.message}`);
      } else {
        toast.error(
          "Erro ao enviar avaliação para reprocessamento. Por favor, tente novamente."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
          Nenhum dado disponível
        </Typography>
        <Typography variant="body1" sx={{ textAlign: "center" }}>
          Parece que houve um problema ao processar a avaliação. Por favor,
          tente novamente mais tarde ou entre em contato com o suporte.
        </Typography>

        {evaluationId && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleReprocessEvaluation}
            disabled={loading}
            sx={{ display: "block", margin: "20px auto 0" }}
          >
            Reprocessar Avaliação
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
