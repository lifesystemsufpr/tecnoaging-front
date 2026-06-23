import { Box } from "@/core/components/ui";
import { EvaluationsByInstitution } from "../type";
import { Building2 } from "lucide-react";

interface EvaluationsByInstitutionTableProps {
  data: EvaluationsByInstitution[];
}

export function EvaluationsByInstitutionTable({
  data,
}: EvaluationsByInstitutionTableProps) {
  if (!data) return null;

  const maxValue = Math.max(...data.map((d) => d.evaluations));

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
          Avaliações por Unidade de Saúde
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Top 5 unidades com maior número de avaliações
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider py-3 pr-4">
                #
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider py-3 pr-4">
                Instituição
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider py-3 pr-4 w-1/3">
                Progresso
              </th>
              <th className="text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider py-3">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              const pct = (item.evaluations / maxValue) * 100;
              return (
                <tr
                  key={item.institution}
                  className="border-b border-gray-50 dark:border-gray-800 last:border-b-0"
                >
                  <td className="py-3.5 pr-4">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-semibold text-gray-600 dark:text-gray-300">
                      {index + 1}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4">
                    <Box display="flex" align="center" gap={8}>
                      <Building2
                        size={16}
                        className="text-gray-400 dark:text-gray-500 flex-shrink-0"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {item.institution}
                      </span>
                    </Box>
                  </td>
                  <td className="py-3.5 pr-4">
                    <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-700">
                      <div
                        className="h-2 rounded-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-3.5 text-right">
                    <span className="text-sm font-semibold text-gray-800 dark:text-white">
                      {item.evaluations.toLocaleString("pt-BR")}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
