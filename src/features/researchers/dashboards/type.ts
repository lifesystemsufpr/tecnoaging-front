// ============================================================================
// 1. TIPOS COMPARTILHADOS (SHARED)
// ============================================================================
export type MetricWithPercentage = {
    absolute: number;
    percentage: number;
};

export type AverageWithDeviation = {
    average: number;
    standardDeviation: number;
};

export type ChartItem = {
    label: string;
    value: number;
};

export interface ApiResponse<T> {
    data: T;
    meta?: {
        generatedAt: string;
        cached: boolean;
    };
}

// ============================================================================
// 2. DASHBOARD DE POPULAÇÃO (POPULATION DASHBOARD)
// ============================================================================

export type GenderDistribution = {
    male: MetricWithPercentage;
    female: MetricWithPercentage;
};

export type ParticipantByUbs = {
    ubs: string;
    absolute: number;
    percentage: number;
};

export interface PopulationKpis {
    totalParticipants: number;
    age: AverageWithDeviation;
    activeParticipants: MetricWithPercentage;
    genderDistribution: GenderDistribution;
}

export interface PopulationCharts {
    ageDistribution: ChartItem[];
    educationLevel: ChartItem[];
    participantsPerUbs: ParticipantByUbs[];
}

export interface PopulationDashboardData {
    kpis: PopulationKpis;
    charts: PopulationCharts;
}


// ============================================================================
// 3. DASHBOARD DE AVALIAÇÕES (EVALUATION DASHBOARD)
// ============================================================================
export type TotalEvaluations = {
    absolute: number;
    percentageSystem: number;
};

export type EvaluatedParticipants = {
    absolute: number;
    percentageTotal: number;
};

export interface EvaluationKpis {
    totalEvaluations: TotalEvaluations;
    evaluatedParticipants: EvaluatedParticipants;
    evaluationsPerParticipant: AverageWithDeviation;
}

export type EvaluationsByTestType = {
    label: string;
    percentage: number;
    absolute: number;
};

export type TemporalEvolution = {
    period: string;
    value: number;
};

export type EvaluationsByInstitution = {
    institution: string;
    evaluations: number;
};

export interface EvaluationCharts {
    evaluationsByTestType: EvaluationsByTestType[];
    temporalEvolution: TemporalEvolution[];
    evaluationsByInstitution: EvaluationsByInstitution[];
}

export interface EvaluationDashboardData {
    kpis: EvaluationKpis;
    charts: EvaluationCharts;
}


export type PopulationDashboardResponse = ApiResponse<PopulationDashboardData>;
export type EvaluationDashboardResponse = ApiResponse<EvaluationDashboardData>;