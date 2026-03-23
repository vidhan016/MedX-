import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../../../../../../core/config/queryKeys";
import { MOCK_PATIENTS } from "../utils/patients.mock";
import type { HistoryPatient, PatientFilters } from "../types/doctor-patients.types";

const get = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed: ${url}`);
  return res.json();
};

export const usePatients = (filters: PatientFilters) =>
  useQuery<HistoryPatient[]>({
    queryKey: queryKeys.patients.list(filters),
    queryFn: async () => {
      try {
        const params = new URLSearchParams(
          Object.entries(filters).filter(([, v]) => v !== "")
        );
        return await get<HistoryPatient[]>(`/api/doctor/patients?${params}`);
      } catch {
        // ── Apply filters client-side on mock data while API is not ready ──
        let data = [...MOCK_PATIENTS];
        const q = filters.search.toLowerCase();

        if (q) data = data.filter((p) =>
          p.name.toLowerCase().includes(q) ||
          p.mrn.toLowerCase().includes(q) ||
          (p.lastDiag ?? "").toLowerCase().includes(q)
        );
        if (filters.gender) data = data.filter((p) => p.gender === filters.gender);
        if (filters.blood)  data = data.filter((p) => p.bloodGroup === filters.blood);
        if (filters.allergy === "has")  data = data.filter((p) => (p.allergies?.length ?? 0) > 0);
        if (filters.allergy === "none") data = data.filter((p) => !p.allergies?.length);

        if (filters.sort === "name-asc")   data.sort((a, b) => a.name.localeCompare(b.name));
        if (filters.sort === "name-desc")  data.sort((a, b) => b.name.localeCompare(a.name));
        if (filters.sort === "age-asc")    data.sort((a, b) => a.age - b.age);
        if (filters.sort === "age-desc")   data.sort((a, b) => b.age - a.age);

        return data;
      }
    },
    staleTime: 2 * 60 * 1000,
  });