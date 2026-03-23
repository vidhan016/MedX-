// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { queryKeys } from "../../../../../../core/config/queryKeys";
// import type { QueuePatient, AppointmentStats, QueueFilters } from "../types/doctor-appointments.types";

// // ── Generic fetcher ────────────────────────────────────────────────────────────

// const get = async <T>(url: string): Promise<T> => {
//   const res = await fetch(url);
//   if (!res.ok) throw new Error(`Failed: ${url}`);
//   return res.json();
// };

// // ── useQueuePatients ───────────────────────────────────────────────────────────

// export const useQueuePatients = (filters: QueueFilters) =>
//   useQuery<QueuePatient[]>({
//     queryKey: queryKeys.doctor.queue(filters),
//     queryFn: () => {
//       const params = new URLSearchParams(
//         Object.entries(filters).filter(([, v]) => v !== "")
//       );
//       return get<QueuePatient[]>(`/api/doctor/appointments/queue?${params}`);
//     },
//     refetchInterval: 30_000, // live queue refreshes every 30s
//   });

// // ── useAttendedPatients ────────────────────────────────────────────────────────

// export const useAttendedPatients = (filters: QueueFilters) =>
//   useQuery<QueuePatient[]>({
//     queryKey: queryKeys.doctor.attended(filters),
//     queryFn: () => {
//       const params = new URLSearchParams(
//         Object.entries(filters).filter(([, v]) => v !== "")
//       );
//       return get<QueuePatient[]>(`/api/doctor/appointments/attended?${params}`);
//     },
//     refetchInterval: 60_000,
//   });

// // ── useAppointmentStats ────────────────────────────────────────────────────────

// export const useAppointmentStats = () =>
//   useQuery<AppointmentStats>({
//     queryKey: queryKeys.doctor.appointmentStats,
//     queryFn: () => get<AppointmentStats>("/api/doctor/appointments/stats"),
//     refetchInterval: 30_000,
//   });
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../../../../../core/config/queryKeys";
import { MOCK_QUEUE, MOCK_ATTENDED } from "../utils/appointments.mock";
import type { QueuePatient, AppointmentStats, QueueFilters } from "../types/doctor-appointments.types";

// ── Generic fetcher ────────────────────────────────────────────────────────────

const get = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed: ${url}`);
  return res.json();
};

// ── useQueuePatients ───────────────────────────────────────────────────────────

export const useQueuePatients = (filters: QueueFilters) =>
  useQuery<QueuePatient[]>({
    queryKey: queryKeys.doctor.queue(filters),
    queryFn: async () => {
      try {
        const params = new URLSearchParams(
          Object.entries(filters).filter(([, v]) => v !== "")
        );
        return await get<QueuePatient[]>(`/api/doctor/appointments/queue?${params}`);
      } catch {
        // ── Return mock data while API is not ready ──
        return MOCK_QUEUE;
      }
    },
    refetchInterval: 30_000,
  });

// ── useAttendedPatients ────────────────────────────────────────────────────────

export const useAttendedPatients = (filters: QueueFilters) =>
  useQuery<QueuePatient[]>({
    queryKey: queryKeys.doctor.attended(filters),
    queryFn: async () => {
      try {
        const params = new URLSearchParams(
          Object.entries(filters).filter(([, v]) => v !== "")
        );
        return await get<QueuePatient[]>(`/api/doctor/appointments/attended?${params}`);
      } catch {
        // ── Return mock data while API is not ready ──
        return MOCK_ATTENDED;
      }
    },
    refetchInterval: 60_000,
  });

// ── useAppointmentStats ────────────────────────────────────────────────────────

export const useAppointmentStats = () =>
  useQuery<AppointmentStats>({
    queryKey: queryKeys.doctor.appointmentStats,
    queryFn: async () => {
      try {
        return await get<AppointmentStats>("/api/doctor/appointments/stats");
      } catch {
        // ── Derive stats from mock data ──
        return {
          totalToday: MOCK_QUEUE.length + MOCK_ATTENDED.length,
          attended:   MOCK_ATTENDED.length,
          waiting:    MOCK_QUEUE.length,
          upcoming:   3,
        };
      }
    },
    refetchInterval: 30_000,
  });