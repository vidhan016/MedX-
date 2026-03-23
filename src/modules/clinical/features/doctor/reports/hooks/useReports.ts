import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../../../../../core/config/queryKeys";
import { MOCK_REPORTS } from "../utils/reports.mock";
import type { ReportsData, ReportPeriod } from "../types/reports.types";

const get = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed: ${url}`);
  return res.json();
};

export const useReportsData = (period: ReportPeriod) =>
  useQuery<ReportsData>({
    queryKey: queryKeys.doctor.reportsData(period),
    queryFn: async () => {
      try {
        return await get<ReportsData>(`/api/doctor/reports?period=${period}`);
      } catch {
        return MOCK_REPORTS;
      }
    },
    staleTime: 5 * 60 * 1000,
  });