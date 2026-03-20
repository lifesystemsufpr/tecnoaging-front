import { useCallback, useEffect, useState } from "react";
import { api as apiEvaluations } from "@/services/apiEvaluations";
import { api as apiPerson } from "@/services/apiPerson";
import {
  DashboardSeries,
  PatientDashboardData,
  PatientEvaluation,
  PatientProfile,
  PerformanceClassification,
} from "../types/patient-dashboard.types";
import {
  calcularIdadeAnos,
  calcularMediaMensalPorTipo,
  classificarTempoPorIdade,
  formatMediaDuracao,
  isFiveTstsType,
  tempoStringParaSegundos,
} from "../utils/patientDashboard.metrics";

const INITIAL_DATA: PatientDashboardData = {
  evaluations: [],
  evaluationsByMonth: Array(12).fill(0),
  mediaDuracao: "0.0s",
  variacaoAvaliacoes: 0,
  countTUG: 0,
  count5TSTS: 0,
  recentSeries: { tug: Array(12).fill(0), fiveTsts: Array(12).fill(0) },
};

export function usePatientDashboard(cpf?: string) {
  const [data, setData] = useState<PatientDashboardData>(INITIAL_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!cpf) {
      setData(INITIAL_DATA);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [evalsRaw, personRaw] = await Promise.all([
        apiEvaluations.getEvaluationsByPersonCpf(cpf),
        apiPerson.getPerfilByCpf(`patient/${cpf}`),
      ]);

      const evals: PatientEvaluation[] = Array.isArray(evalsRaw)
        ? evalsRaw
        : [];
      const person: PatientProfile = personRaw || {};

      let tug = 0;
      let five = 0;

      evals.forEach((ev) => {
        if (ev.type === "TUG") tug += 1;
        if (isFiveTstsType(ev.type)) five += 1;
      });

      const mediaTug = calcularMediaMensalPorTipo(evals, "TUG");
      const mediaFive = calcularMediaMensalPorTipo(evals, "5TSTS");
      const recentSeries: DashboardSeries = {
        tug: mediaTug,
        fiveTsts: mediaFive,
      };

      const counts = Array(12).fill(0);
      let totalSegundos = 0;
      const classificacoes: {
        mes: number;
        classificacao: PerformanceClassification;
      }[] = [];
      const now = new Date();
      const birthDate = person.dateOfBirth || person.birthday || "";

      evals.forEach((ev) => {
        const date = new Date(ev.date);
        const month = date.getMonth();
        counts[month] += 1;

        const tempo = tempoStringParaSegundos(ev.totalTime);
        totalSegundos += tempo;

        if (birthDate) {
          const idade = calcularIdadeAnos(birthDate, ev.date);
          const classificacao = classificarTempoPorIdade(tempo, idade, ev.type);
          classificacoes.push({ mes: month, classificacao });
        }
      });

      const mediaSegundos = evals.length ? totalSegundos / evals.length : 0;
      const mediaDuracao = formatMediaDuracao(mediaSegundos);

      const mesAtual = now.getMonth();

      const avaliacoesMesAtual = counts[mesAtual];
      const avaliacoesMesAnterior = counts[mesAtual - 1] || 0;
      const variacaoAvaliacoes =
        avaliacoesMesAnterior > 0
          ? Number(
              (
                ((avaliacoesMesAtual - avaliacoesMesAnterior) /
                  avaliacoesMesAnterior) *
                100
              ).toFixed(0)
            )
          : 0;

      setData({
        evaluations: evals,
        evaluationsByMonth: counts,
        mediaDuracao,
        variacaoAvaliacoes,
        countTUG: tug,
        count5TSTS: five,
        recentSeries,
      });
    } catch (err) {
      console.error("Erro ao buscar dados do dashboard do participante:", err);
    } finally {
      setIsLoading(false);
    }
  }, [cpf]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, isLoading, error, reload: fetch };
}
