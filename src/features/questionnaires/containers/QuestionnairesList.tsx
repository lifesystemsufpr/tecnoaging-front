"use client";
import { Box, Typography } from "@mui/material";
import QuestionnaireListFilters from "../components/QuestionnaireListFilters";

export function QuestionnairesList() {
  return (
    <Box>
      <Typography variant="body1">Questionarios</Typography>
      <QuestionnaireListFilters />
    </Box>
  );
}
