"use client";

import {
  ListEvaluationsProvider,
  useListEvaluationsContext,
} from "../contexts/ListEvaluationsContext";
import { ListEvaluationsFilters } from "../components/ListEvaluationsFilters";
import { EvaluationType } from "../types/Evaluation.types";
import EvaluationTable from "../containers/EvaluationTable";
import { Box, Typography } from "@/core/components/ui";

// ─── Inner content (must be inside the provider) ──────────────────────────────
function ListEvaluationsContent() {
  const { requestFilters } = useListEvaluationsContext();

  return (
    <Box display="flex" direction="column" gap={12}>
      <Box
        display="flex"
        direction="row"
        justify="space-between"
        align="center"
      >
        <Typography variant="h4" color="secondary">
          Gerenciar Avaliações
        </Typography>
      </Box>

      <Box mt={1} mb={1}>
        <ListEvaluationsFilters />
      </Box>

      <EvaluationTable filters={requestFilters} />
    </Box>
  );
}

// ─── Exported page (wraps with provider) ──────────────────────────────────────
export function ListEvaluations({ type }: { type?: EvaluationType | "TMSTS" }) {
  return (
    <ListEvaluationsProvider type={type ?? "Todos"}>
      <ListEvaluationsContent />
    </ListEvaluationsProvider>
  );
}
