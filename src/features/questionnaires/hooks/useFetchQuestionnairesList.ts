import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { questionnairesService } from "../services/questionnaires.service";
import { PageSizeOption } from "@/types/enums/page-size-options";
import { QuestionnaireList } from "../types/domain";

export interface QuestionnairesFilters {
  participantCpf?: string;
  healthProfessionalCpf?: string;
}

interface UseFetchQuestionnairesListProps {
  pageSize?: PageSizeOption;
}

export default function useFetchQuestionnairesList({
  pageSize = 10,
}: UseFetchQuestionnairesListProps = {}) {
  const [filters, setFilters] = useState<QuestionnairesFilters>({});
  const [paginationModel, setPaginationModel] = useState({
    pageSize,
    page: 0,
  });

  const query = useQuery({
    queryKey: ["questionnaires", paginationModel, filters],
    queryFn: async () => {
      const resp = await questionnairesService.fetchQuestionnaires({
        pageSize: paginationModel.pageSize,
        page: paginationModel.page + 1,
        participantCpf: filters.participantCpf,
        healthProfessionalCpf: filters.healthProfessionalCpf,
      });
      return resp;
    },
  });

  const applyFilters = useCallback((nextFilters: QuestionnairesFilters) => {
    setFilters(nextFilters);
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, []);

  const rows: QuestionnaireList = query.data?.data ?? [];
  const totalRows = query.data?.meta.total ?? 0;

  return {
    rows,
    totalRows,
    paginationModel,
    setPaginationModel,
    applyFilters,
    filters,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
  };
}
