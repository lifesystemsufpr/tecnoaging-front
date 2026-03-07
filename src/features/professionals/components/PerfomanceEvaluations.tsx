import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Stack,
  Chip,
  LinearProgress,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonIcon from "@mui/icons-material/Person";

export default function PerformanceEvaluations() {
  const [data, setData] = useState({ mediaEquipe: 0, individual: 0 });
  const [loading, setLoading] = useState(true);

  async function fetchEstatisticas() {
    try {
      setLoading(true);
      // Simulação de API
      const response = await fetch("/api/estatisticas/desempenho-mes");
      const result = await response.json();
      setData({
        mediaEquipe: result.mediaEquipe || 0,
        individual: result.individual || 0,
      });
    } catch (err) {
      console.error("Erro ao buscar estatísticas:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEstatisticas();
    const interval = setInterval(fetchEstatisticas, 30000);
    return () => clearInterval(interval);
  }, []);

  const isAboveAverage = data.individual >= data.mediaEquipe;
  const diff = data.individual - data.mediaEquipe;

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        maxWidth: 400,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={3}
        >
          <Typography variant="subtitle1" fontWeight="700" color="text.primary">
            Performance
          </Typography>
          {!loading && (
            <Chip
              icon={
                isAboveAverage ? (
                  <TrendingUpIcon fontSize="small" />
                ) : (
                  <TrendingDownIcon fontSize="small" />
                )
              }
              label={isAboveAverage ? "Acima da média" : "Abaixo da média"}
              size="small"
              color={isAboveAverage ? "success" : "error"}
              variant="outlined"
              sx={{ fontWeight: "bold", borderRadius: 1.5 }}
            />
          )}
        </Stack>

        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress size={32} thickness={5} />
          </Box>
        ) : (
          <Stack spacing={3}>
            {/* Seu Desempenho (Destaque) */}
            <Box>
              <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                <PersonIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight="500"
                >
                  Seu Desempenho Individual
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="800">
                {data.individual.toFixed(2)}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min((data.individual / 10) * 100, 100)} // Supondo escala de 0 a 10
                sx={{ height: 6, borderRadius: 3, mt: 1, bgcolor: "grey.100" }}
                color={isAboveAverage ? "success" : "warning"}
              />
            </Box>

            {/* Média da Equipe (Comparativo) */}
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "action.hover",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box display="flex" alignItems="center" gap={1.5}>
                <GroupsIcon sx={{ color: "primary.main" }} />
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    sx={{ lineHeight: 1 }}
                  >
                    MÉDIA EQUIPE
                  </Typography>
                  <Typography variant="h6" fontWeight="700">
                    {data.mediaEquipe.toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              <Box textAlign="right">
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  DIFERENÇA
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  color={diff >= 0 ? "success.main" : "error.main"}
                >
                  {diff >= 0 ? `+${diff.toFixed(2)}` : diff.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
