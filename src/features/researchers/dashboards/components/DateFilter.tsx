"use client";

import React, { useState } from "react";
import { Input, Typography, Box, Button } from "@/core/components/ui";
import { Calendar, Search, X } from "lucide-react";

export interface DateFilterProps {
    onApply: (startDate: string, endDate: string) => void;
    onClear?: () => void;
    initialStartDate?: string;
    initialEndDate?: string;
}

export function DateFilter({
    onApply,
    onClear,
    initialStartDate = "",
    initialEndDate = "",
}: DateFilterProps) {
    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);

    const handleApply = () => {
        onApply(startDate, endDate);
    };

    const handleClear = () => {
        setStartDate("");
        setEndDate("");
        if (onClear) {
            onClear();
        } else {
            onApply("", "");
        }
    };

    return (
        <Box
            className="py-2 px-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm w-full xl:w-auto"
            display="flex"
            direction="column"
            align="center"
            justify="space-between"
            wrap="wrap"
            gap={16}
        >
            {/* Rótulo mais direto */}
            <Box display="flex" align="center" gap={8} className="w-full sm:w-auto">
                <Calendar className="text-gray-500 dark:text-gray-400 shrink-0" size={18} />
                <Typography variant="body" className="font-medium text-sm text-gray-700 dark:text-gray-200 whitespace-nowrap">
                    Período
                </Typography>
            </Box>

            {/* Agrupamento dos Inputs e Botões */}
            <Box
                display="flex"
                direction="row"
                align="center"
                gap={8}
                className="w-full sm:w-auto"
            >
                <Input
                    type="date"
                    placeholder="Início"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full sm:w-[140px] text-sm"
                />

                <Typography variant="body" className="text-gray-400 dark:text-gray-500 hidden sm:block text-sm">
                    até
                </Typography>

                <Input
                    type="date"
                    placeholder="Fim"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full sm:w-[140px] text-sm"
                />

                <Box display="flex" align="center" gap={4} className="w-full sm:w-auto mt-2 sm:mt-0">
                    <Button
                        variant="default"
                        size="sm"
                        onClick={handleApply}
                        className="w-full sm:w-auto px-3"
                        tooltip="Filtrar"
                    >
                        <Search size={16} />
                    </Button>

                    {(startDate || endDate) && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleClear}
                            className="w-full sm:w-auto px-2"
                            tooltip="Limpar filtros"
                        >
                            <X size={16} />
                        </Button>
                    )}
                </Box>
            </Box>
        </Box>
    );
}