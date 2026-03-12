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

export default function TotalEvaluations() {
  const [data, setData] = useState({ total: 0, masculino: 0, feminino: 0 });
  const [loading, setLoading] = useState(true);

  async function fetchAvaliacoes() {
    try {
      // Simulando a API - Substitua pela sua chamada real
      const response = await fetch("/api/avaliacoes/mes-atual");
      const result = await response.json();
      setData({
        total: result.total,
        masculino: result.masculino,
        feminino: result.feminino,
      });
    } catch (err) {
      console.error("Erro ao buscar avaliações:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAvaliacoes();
    const interval = setInterval(fetchAvaliacoes, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        maxWidth: 400,
        bgcolor: "background.paper",
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

        {loading ? (
          <Box display="flex" justifyContent="center" py={3}>
            <CircularProgress size={30} thickness={5} />
          </Box>
        ) : (
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
                  {data.masculino}
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
                  {data.feminino}
                </Typography>
              </Box>
            </Box>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
