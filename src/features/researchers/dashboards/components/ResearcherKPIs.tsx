"use client";

import { Users2, UserCheck, Activity, VenusAndMars } from "lucide-react";
import Card from "@/core/components/layout/Card";
import { Box, Grid, Typography } from "@/core/components/ui";
import { PopulationKpis } from "../type";

interface ResearcherKPIsProps {
  data: PopulationKpis;
}

export default function ResearcherKPIs({ data }: ResearcherKPIsProps) {
  const { totalParticipants, age, activeParticipants, genderDistribution } =
    data;

  return (
    <Grid container spacing={20} className="w-full">
      {/* Total de Participantes */}
      <Grid item xs={12} sm={6} md={6} lg={3}>
        <Card.Root>
          <Box display="flex" align="center" gap={14} mb={8}>
            <Box className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <Users2 size={24} className="text-blue-600 dark:text-blue-400" />
            </Box>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total de Participantes +60
            </p>
          </Box>
          <Typography className="text-3xl font-bold text-gray-800 dark:text-white">
            {totalParticipants.toLocaleString("pt-BR")}
          </Typography>
          <Typography className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Total cadastrados no sistema com mais de 60 anos
          </Typography>
        </Card.Root>
      </Grid>

      {/* Participantes Avaliados */}
      <Grid item xs={12} sm={6} md={6} lg={3}>
        <Card.Root>
          <Box display="flex" align="center" gap={14} mb={8}>
            <Box className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
              <UserCheck
                size={24}
                className="text-emerald-600 dark:text-emerald-400"
              />
            </Box>
            <Typography className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Participantes Avaliados
            </Typography>
          </Box>
          <Typography className="text-3xl font-bold text-gray-800 dark:text-white">
            {activeParticipants.absolute.toLocaleString("pt-BR")}
          </Typography>
          <Box display="flex" align="center" gap={6} mt={4}>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
              {activeParticipants.percentage.toFixed(1)}%
            </span>
            <Typography className="text-xs text-gray-400 dark:text-gray-500">
              do total
            </Typography>
          </Box>
        </Card.Root>
      </Grid>

      {/* Idade Média */}
      <Grid item xs={12} sm={6} md={6} lg={3}>
        <Card.Root>
          <Box display="flex" align="center" gap={14} mb={8}>
            <Box className="p-2.5 rounded-xl bg-violet-100 dark:bg-violet-900/30">
              <Activity
                size={24}
                className="text-violet-600 dark:text-violet-400"
              />
            </Box>
            <Typography className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Idade Média
            </Typography>
          </Box>
          <Box display="flex" align="baseline" gap={8}>
            <Typography className="text-3xl font-bold text-gray-800 dark:text-white">
              {age.average.toFixed(1)}
            </Typography>
            <Typography className="text-sm text-gray-400">anos</Typography>
          </Box>
          <Typography className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            DP: ±{age.standardDeviation.toFixed(1)} anos
          </Typography>
        </Card.Root>
      </Grid>

      {/* Distribuição por Gênero */}
      <Grid item xs={12} sm={6} md={6} lg={3}>
        <Card.Root>
          <Box display="flex" align="center" gap={14} mb={8}>
            <Box className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-900/30">
              <VenusAndMars
                size={24}
                className="text-rose-600 dark:text-rose-400"
              />
            </Box>
            <Typography className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Distribuição por Gênero
            </Typography>
          </Box>
          <Box display="flex" direction="column" gap={8} mt={4}>
            <Box display="flex" justify="space-between" align="center">
              <Box display="flex" align="center" gap={6}>
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Masculino
                </span>
              </Box>
              <Box display="flex" align="center" gap={6}>
                <span className="text-sm font-semibold text-gray-800 dark:text-white">
                  {genderDistribution.male.absolute.toLocaleString("pt-BR")}
                </span>
                <span className="text-xs text-gray-400">
                  ({genderDistribution.male.percentage.toFixed(1)}%)
                </span>
              </Box>
            </Box>
            {/* Male progress bar */}
            <Box className="w-full h-1.5 rounded-full bg-gray-100 dark:bg-gray-700">
              <Box
                className="h-1.5 rounded-full bg-blue-500"
                style={{ width: `${genderDistribution.male.percentage}%` }}
              />
            </Box>
            <Box display="flex" justify="space-between" align="center">
              <Box display="flex" align="center" gap={6}>
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Feminino
                </span>
              </Box>
              <Box display="flex" align="center" gap={6}>
                <span className="text-sm font-semibold text-gray-800 dark:text-white">
                  {genderDistribution.female.absolute.toLocaleString("pt-BR")}
                </span>
                <span className="text-xs text-gray-400">
                  ({genderDistribution.female.percentage.toFixed(1)}%)
                </span>
              </Box>
            </Box>
            {/* Female progress bar */}
            <div className="w-full h-1.5 rounded-full bg-gray-100 dark:bg-gray-700">
              <div
                className="h-1.5 rounded-full bg-rose-500"
                style={{ width: `${genderDistribution.female.percentage}%` }}
              />
            </div>
          </Box>
        </Card.Root>
      </Grid>
    </Grid>
  );
}
