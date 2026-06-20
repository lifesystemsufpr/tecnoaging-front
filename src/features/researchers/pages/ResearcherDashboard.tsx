"use client";

import { useState } from "react";
import { Box, Typography, Tabs, TabList, Tab, TabPanel } from "@/core/components/ui";
import { EvaluationsDashboardTab, ParticipantsDashboardTab, DateFilter } from "../dashboards";

export function ResearcherDashboard() {
  const [activeTab, setActiveTab] = useState<string | number>("participants");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  return (
    <Box display="flex" direction="column" gap={24}>
      {/* Header */}
      <Box
        display="flex"
        align="center"
        justify="space-between"
        wrap="wrap"
        gap={16}
        className="w-full"
      >
        <div className=" min-w-[200px]">
          <Typography variant="h4" color="secondary" className="font-bold">
            Painel do Pesquisador
          </Typography>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Visão geral dos participantes e avaliações
          </p>
        </div>

        <DateFilter
          initialStartDate={startDate}
          initialEndDate={endDate}
          onApply={(start, end) => {
            setStartDate(start);
            setEndDate(end);
          }}
          onClear={() => {
            setStartDate("");
            setEndDate("");
          }}
        />
      </Box>

      {/* Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab}>
        <TabList>
          <Tab value="participants" label="Participantes" />
          <Tab value="evaluations" label="Avaliações" />
        </TabList>

        <TabPanel value="participants">
          <ParticipantsDashboardTab startDate={startDate} endDate={endDate} />
        </TabPanel>

        <TabPanel value="evaluations">
          <EvaluationsDashboardTab startDate={startDate} endDate={endDate} />
        </TabPanel>
      </Tabs>
    </Box>
  );
}
