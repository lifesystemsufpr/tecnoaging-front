export const dashboard = {
    data: {
        kpis: {
            totalParticipants: 2450,
            age: {
                average: 42.5,
                standardDeviation: 14.2
            },
            activeParticipants: {
                absolute: 1837,
                percentage: 74.98
            },
            genderDistribution: {
                male: {
                    absolute: 1102,
                    percentage: 44.98
                },
                female: {
                    absolute: 1348,
                    percentage: 55.02
                }
            }
        },
        charts: {
            ageDistribution: [
                { label: "18-29", value: 415 },
                { label: "30-49", value: 980 },
                { label: "50-59", value: 530 },
                { label: "60+", value: 525 }
            ],
            educationLevel: [
                { label: "Ensino Fundamental", value: 520 },
                { label: "Ensino Médio", value: 1150 },
                { label: "Ensino Superior", value: 780 }
            ],
            participantsPerUbs: [
                { ubs: "UBS Centro", absolute: 850, percentage: 34.69 },
                { ubs: "UBS Norte", absolute: 600, percentage: 24.49 },
                { ubs: "UBS Sul", absolute: 1000, percentage: 40.82 }
            ]
        }
    },
}

export const dasboardEvaluation = {
    data: {
        kpis: {
            totalEvaluations: {
                absolute: 6582,
                percentageSystem: 100
            },
            evaluatedParticipants: {
                absolute: 2243,
                percentageTotal: 78.9
            },
            evaluationsPerParticipant: {
                average: 2.9,
                standardDeviation: 1.3
            }
        },
        charts: {
            evaluationsByTestType: [
                { label: "30STS", percentage: 66.7, absolute: 4392 },
                { label: "2MST", percentage: 33.3, absolute: 2190 },
                { label: "Outros Testes", percentage: 0.0, absolute: 0 }
            ],
            temporalEvolution: [
                { period: "Jan", value: 428 },
                { period: "Fev", value: 512 },
                { period: "Mar", value: 588 },
                { period: "Abr", value: 623 },
                { period: "Mai", value: 612 },
                { period: "Jun", value: 701 },
                { period: "Jul", value: 712 },
                { period: "Ago", value: 734 },
                { period: "Set", value: 665 },
                { period: "Out", value: 713 },
                { period: "Nov", value: 824 },
                { period: "Dez", value: 965 }
            ],
            evaluationsByInstitutionTop5: [
                { institution: "UBS Centro", evaluations: 1284 },
                { institution: "UBS Norte", evaluations: 1105 },
                { institution: "UBS Sul", evaluations: 943 },
                { institution: "UBS Leste", evaluations: 821 },
                { institution: "UBS Oeste", evaluations: 712 }
            ]
        }
    }
}
