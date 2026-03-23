// import { useQuery } from "@tanstack/react-query";
// import { queryKeys } from "../../../../../../core/config/queryKeys";
// import type {
//   DoctorStats,
//   NextPatient,
//   ScheduleSlot,
//   UpcomingAppointment,
//   DiagFilter,
//   DiagnosisItem,
//   ActivityItem,
//   WeeklyFlowPoint,
//   DrugItem,
//   CustomRange,
// } from "../types/doctor-home.types";

// // ── API functions ──────────────────────────────────────────────────────────────

// const get = async <T>(url: string): Promise<T> => {
//   const res = await fetch(url);
//   if (!res.ok) throw new Error(`Failed: ${url}`);
//   return res.json();
// };

// // ── useDoctorStats ─────────────────────────────────────────────────────────────

// export interface StatsData {
//   stats: DoctorStats;
//   nextPatient: NextPatient | null;
// }

// export const useDoctorStats = () =>
//   useQuery<StatsData>({
//     queryKey: queryKeys.doctor.homeStats,
//     queryFn: () => get<StatsData>("/api/doctor/home/stats"),
//     refetchInterval: 30_000, // live queue updates every 30s
//   });

// // ── useTodaySchedule ───────────────────────────────────────────────────────────

// export const useTodaySchedule = () =>
//   useQuery<ScheduleSlot[]>({
//     queryKey: queryKeys.doctor.todaySchedule,
//     queryFn: () => get<ScheduleSlot[]>("/api/doctor/home/schedule"),
//     staleTime: 2 * 60 * 1000,
//   });

// // ── useUpcomingAppointments ────────────────────────────────────────────────────

// export const useUpcomingAppointments = () =>
//   useQuery<UpcomingAppointment[]>({
//     queryKey: queryKeys.doctor.upcoming,
//     queryFn: () => get<UpcomingAppointment[]>("/api/doctor/home/upcoming"),
//     refetchInterval: 60_000,
//   });

// // ── useTopDiagnoses ────────────────────────────────────────────────────────────

// export const useTopDiagnoses = (
//   filter: DiagFilter,
//   customRange?: CustomRange
// ) =>
//   useQuery<DiagnosisItem[]>({
//     queryKey: queryKeys.doctor.topDiagnoses(filter, customRange),
//     queryFn: () => {
//       const params = new URLSearchParams({ filter });
//       if (filter === "custom" && customRange?.from && customRange?.to) {
//         params.set("from", customRange.from);
//         params.set("to", customRange.to);
//       }
//       return get<DiagnosisItem[]>(`/api/doctor/home/diagnoses?${params}`);
//     },
//     enabled: filter !== "custom" || !!(customRange?.from && customRange?.to),
//     staleTime: 5 * 60 * 1000,
//   });

// // ── useRecentActivity ──────────────────────────────────────────────────────────

// export interface ActivityData {
//   activity: ActivityItem[];
//   weeklyFlow: WeeklyFlowPoint[];
//   topDrugs: DrugItem[];
// }

// export const useRecentActivity = () =>
//   useQuery<ActivityData>({
//     queryKey: queryKeys.doctor.recentActivity,
//     queryFn: () => get<ActivityData>("/api/doctor/home/activity"),
//     refetchInterval: 60_000,
//   });
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../../../../../../core/config/queryKeys";
import {
  MOCK_STATS,
  MOCK_SCHEDULE,
  MOCK_UPCOMING,
  MOCK_DIAGNOSES,
  MOCK_ACTIVITY,
} from "../utils/doctor-home.mock";
import type {
  ScheduleSlot,
  UpcomingAppointment,
  DiagFilter,
  DiagnosisItem,
  ActivityItem,
  WeeklyFlowPoint,
  DrugItem,
  CustomRange,
} from "../types/doctor-home.types";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface StatsData {
  stats: {
    totalToday: number;
    attended: number;
    pending: number;
    totalRevenue: number;
    cancelled: number;
    noShow: number;
  };
  nextPatient: {
    salutation: string;
    name: string;
    age: number;
    gender: string;
    appointmentTime: string;
  } | null;
}

export interface ActivityData {
  activity:   ActivityItem[];
  weeklyFlow: WeeklyFlowPoint[];
  topDrugs:   DrugItem[];
}

// ── Generic fetcher ────────────────────────────────────────────────────────────

const get = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed: ${url}`);
  return res.json();
};

// ── useDoctorStats ─────────────────────────────────────────────────────────────

export const useDoctorStats = () =>
  useQuery<StatsData>({
    queryKey: queryKeys.doctor.homeStats,
    queryFn: async () => {
      try { return await get<StatsData>("/api/doctor/home/stats"); }
      catch { return MOCK_STATS; }
    },
    refetchInterval: 30_000,
  });

// ── useTodaySchedule ───────────────────────────────────────────────────────────

export const useTodaySchedule = () =>
  useQuery<ScheduleSlot[]>({
    queryKey: queryKeys.doctor.todaySchedule,
    queryFn: async () => {
      try { return await get<ScheduleSlot[]>("/api/doctor/home/schedule"); }
      catch { return MOCK_SCHEDULE; }
    },
    staleTime: 2 * 60 * 1000,
  });

// ── useUpcomingAppointments ────────────────────────────────────────────────────

export const useUpcomingAppointments = () =>
  useQuery<UpcomingAppointment[]>({
    queryKey: queryKeys.doctor.upcoming,
    queryFn: async () => {
      try { return await get<UpcomingAppointment[]>("/api/doctor/home/upcoming"); }
      catch { return MOCK_UPCOMING; }
    },
    refetchInterval: 60_000,
  });

// ── useTopDiagnoses ────────────────────────────────────────────────────────────

export const useTopDiagnoses = (
  filter: DiagFilter,
  customRange?: CustomRange
) =>
  useQuery<DiagnosisItem[]>({
    queryKey: queryKeys.doctor.topDiagnoses(filter, customRange),
    queryFn: async () => {
      try {
        const params = new URLSearchParams({ filter });
        if (filter === "custom" && customRange?.from && customRange?.to) {
          params.set("from", customRange.from);
          params.set("to", customRange.to);
        }
        return await get<DiagnosisItem[]>(`/api/doctor/home/diagnoses?${params}`);
      } catch {
        return MOCK_DIAGNOSES;
      }
    },
    enabled: filter !== "custom" || !!(customRange?.from && customRange?.to),
    staleTime: 5 * 60 * 1000,
  });

// ── useRecentActivity ──────────────────────────────────────────────────────────

export const useRecentActivity = () =>
  useQuery<ActivityData>({
    queryKey: queryKeys.doctor.recentActivity,
    queryFn: async () => {
      try { return await get<ActivityData>("/api/doctor/home/activity"); }
      catch { return MOCK_ACTIVITY; }
    },
    refetchInterval: 60_000,
  });