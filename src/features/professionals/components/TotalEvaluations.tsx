import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Avatar,
  Stack,
} from "@mui/material";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import AssessmentIcon from "@mui/icons-material/Assessment";
import GroupIcon from "@mui/icons-material/Group";
import { CurrentMonthByGender } from "../types";

interface TotalEvaluationsProps {
  data: CurrentMonthByGender;
}

export default function TotalEvaluations({ data }: TotalEvaluationsProps) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        width: "100%",
        boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
        bgcolor: "background.paper",
        "&:hover": { transform: "translateY(-2px)" },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography
            variant="subtitle1"
            fontWeight="600"
            color="text.secondary"
          >
            Avaliações do Mês
          </Typography>
          <Avatar sx={{ bgcolor: "primary.light", width: 32, height: 32 }}>
            <AssessmentIcon sx={{ fontSize: 18, color: "primary.main" }} />
          </Avatar>
        </Box>

        <Stack spacing={3}>
          {/* Bloco de Destaque (Total) */}
          <Box>
            <Typography variant="h3" fontWeight="800" letterSpacing={-1}>
              {data.total}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              <GroupIcon sx={{ fontSize: 16 }} /> total de pacientes atendidos
            </Typography>
          </Box>

          {/* Sub-estatísticas */}
          <Box
            display="flex"
            gap={2}
            sx={{
              p: 2,
              bgcolor: "grey.50",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "grey.100",
            }}
          >
            <Box flex={1}>
              <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                <MaleIcon sx={{ color: "#1976d2", fontSize: 18 }} />
                <Typography
                  variant="caption"
                  fontWeight="bold"
                  color="text.secondary"
                  sx={{ textTransform: "uppercase" }}
                >
                  Homens
                </Typography>
              </Box>
              <Typography variant="h6" fontWeight="700">
                {data.male}
              </Typography>
            </Box>

            <Box flex={1}>
              <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                <FemaleIcon sx={{ color: "#d32f2f", fontSize: 18 }} />
                <Typography
                  variant="caption"
                  fontWeight="bold"
                  color="text.secondary"
                  sx={{ textTransform: "uppercase" }}
                >
                  Mulheres
                </Typography>
              </Box>
              <Typography variant="h6" fontWeight="700">
                {data.female}
              </Typography>
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
