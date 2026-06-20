"use client";

import { Box, Grid } from "@/core/components/ui";
import { ClipboardCheck, TrendingUp, UserCheck } from "lucide-react";
import { EvaluationKpis } from "../type";
import Card from "@/core/components/layout/Card";

interface EvaluationKPIsProps {
    data: EvaluationKpis;
}

export function EvaluationKPIs({
    data,
}: EvaluationKPIsProps) {
    const { totalEvaluations, evaluatedParticipants, evaluationsPerParticipant } =
        data;

    return (
        <Grid container spacing={20} className="w-full">
            {/* Total de Avaliações */}
            <Grid item xs={12} sm={6} md={4}>
                <Card.Root>
                    <Box display="flex" align="center" gap={14} mb={8}>
                        <Box className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                            <ClipboardCheck
                                size={24}
                                className="text-blue-600 dark:text-blue-400"
                            />
                        </Box>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Total de Avaliações
                        </p>
                    </Box>
                    <h4 className="text-3xl font-bold text-gray-800 dark:text-white">
                        {totalEvaluations.absolute.toLocaleString("pt-BR")}
                    </h4>
                    <Box display="flex" align="center" gap={6} mt={4}>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
                            {totalEvaluations.percentageSystem}%
                        </span>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                            do sistema
                        </p>
                    </Box>
                </Card.Root>
            </Grid>

            {/* Participantes Avaliados */}
            <Grid item xs={12} sm={6} md={4}>
                <Card.Root>
                    <Box display="flex" align="center" gap={14} mb={8}>
                        <Box className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                            <UserCheck
                                size={24}
                                className="text-emerald-600 dark:text-emerald-400"
                            />
                        </Box>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Participantes Avaliados
                        </p>
                    </Box>
                    <h4 className="text-3xl font-bold text-gray-800 dark:text-white">
                        {evaluatedParticipants.absolute.toLocaleString("pt-BR")}
                    </h4>
                    <Box display="flex" align="center" gap={6} mt={4}>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                            {evaluatedParticipants.percentageTotal}%
                        </span>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                            do total
                        </p>
                    </Box>
                </Card.Root>
            </Grid>

            {/* Média de Avaliações por Participante */}
            <Grid item xs={12} sm={6} md={4}>
                <Card.Root>
                    <Box display="flex" align="center" gap={14} mb={8}>
                        <Box className="p-2.5 rounded-xl bg-violet-100 dark:bg-violet-900/30">
                            <TrendingUp
                                size={24}
                                className="text-violet-600 dark:text-violet-400"
                            />
                        </Box>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Média por Participante
                        </p>
                    </Box>
                    <Box display="flex" align="baseline" gap={8}>
                        <h4 className="text-3xl font-bold text-gray-800 dark:text-white">
                            {evaluationsPerParticipant.average.toFixed(1)}
                        </h4>
                        <span className="text-sm text-gray-400">avaliações</span>
                    </Box>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        DP: ±{evaluationsPerParticipant.standardDeviation.toFixed(1)}
                    </p>
                </Card.Root>
            </Grid>
        </Grid>
    );
}