import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from "@/core/components/ui";
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
    <Card variant="outlined" className="mb-2 border-gray-100 p-5">
      <CardContent>
        <Typography variant="h4" className="mb-4 text-center">
          Nenhum dado disponível
        </Typography>
        <Typography variant="body" className="text-center">
          Parece que houve um problema ao processar a avaliação. Por favor,
          tente novamente mais tarde ou entre em contato com o suporte.
        </Typography>

        {evaluationId && (
          <Box mt={20} display="flex" justify="center">
            <Button
              onClick={handleReprocessEvaluation}
              disabled={loading}
              loading={loading}
              loadingText="Reprocessando"
            >
              Reprocessar Avaliação
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
